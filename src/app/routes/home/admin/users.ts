import { Component, View } from 'angular2/core';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, UsersService } from '../../../services';
import { PaginationComponent, TableComponent } from '../../../components';
import { Log } from '../../../models';
import _ = require('lodash');
import moment = require('moment');
import { TimestampPipe, MomentPipe, ReversePipe, FilterPipe, RepeatPipe, PagePipe, CountPipe } from '../../../pipes';
declare var $: any;

@Component({})
@View({
  template: require('./users.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
    ReversePipe,
    FilterPipe,
    RepeatPipe,
    PagePipe,
    CountPipe,
  ]
})
export class UsersRoute extends TableComponent {
  constructor(navbar: NavbarService,
              service: UsersService,
              private timestamp: TimestampPipe) {
    super(service);
    navbar.active('admin/users');

    $('.ui.dropdown').dropdown();

    service.list().subscribe(r => {
      this.page.itemCount = r && r.length || 0;
      this.loading = r === null;
    });

    service.refresh();
  }

  filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x.name.indexOf(this.search.keyword) !== -1 ||
            x.enabled.toString().indexOf(this.search.keyword) !== -1 ||
            x.role.indexOf(this.search.keyword) !== -1;
        case 'name':
          return x.name.indexOf(this.search.keyword) !== -1;
        case 'enabled':
          return x.enabled.toString().indexOf(this.search.keyword) !== -1;
        case 'role':
          return x.role.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }

  edit(item: any) {
    this.service.edit(item);
  }
}

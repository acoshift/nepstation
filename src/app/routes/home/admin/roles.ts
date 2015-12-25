import { Component, View } from 'angular2/core';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, RolesService } from '../../../services';
import { PaginationComponent, TableComponent } from '../../../components';
import _ = require('lodash');
import moment = require('moment');
import { TimestampPipe, MomentPipe, ReversePipe, FilterPipe, RepeatPipe, PagePipe, CountPipe } from '../../../pipes';
declare var $: any;

@Component({})
@View({
  template: require('./roles.jade'),
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
export class RolesRoute extends TableComponent {
  constructor(navbar: NavbarService,
              service: RolesService,
              private timestamp: TimestampPipe) {
    super(service);
    navbar.active('admin/roles');

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
          return x.name.indexOf(this.search.keyword) !== -1;
        case 'name':
          return x.name.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }

  edit(item: any) {
    this.service.edit(item);
  }
}

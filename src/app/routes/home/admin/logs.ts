import { Component, View } from 'angular2/core';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, LogsService } from '../../../services';
import { PaginationComponent, TableComponent } from '../../../components';
import { Log } from '../../../models';
import _ = require('lodash');
import moment = require('moment');
import { TimestampPipe, MomentPipe, ReversePipe, FilterPipe, RepeatPipe, PagePipe, CountPipe } from '../../../pipes';
declare var $: any;

@Component({})
@View({
  template: require('./logs.jade'),
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
export class LogsRoute extends TableComponent {
  constructor(navbar: NavbarService,
              private logs: LogsService,
              private timestamp: TimestampPipe) {
    super();
    navbar.active('admin/logs');

    $('.ui.dropdown').dropdown();

    logs.list().subscribe(r => {
      this.page.itemCount = r && r.length || 0;
      this.loading = r === null;
    });

    logs.refresh();
  }

  filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x.t.payload.sub.split('/')[0].indexOf(this.search.keyword) !== -1 ||
            x.q.method.indexOf(this.search.keyword) !== -1 ||
            x.q.name.indexOf(this.search.keyword) !== -1;
        case 'user':
          return x.t.payload.sub.split('/')[0].indexOf(this.search.keyword) !== -1;
        case 'method':
          return x.q.method.indexOf(this.search.keyword) !== -1;
        case 'collection':
          return x.q.name.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }
}

import { Component, View } from 'angular2/core';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, LogsService } from '../../../services';
import { PaginationComponent, TableComponent } from '../../../components';
import _ = require('lodash');
import moment = require('moment');
import { TimestampPipe, MomentPipe } from '../../../pipes';
import { Directives } from '../../../directives';
declare var $: any;

@Component({})
@View({
  template: require('./logs.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    Directives,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
  ]
})
export class LogsRoute extends TableComponent {
  constructor(navbar: NavbarService,
              service: LogsService) {
    super(service);
    navbar.active('admin/logs');

    this.page.itemPerPage = 23;
  }

  get filter() {
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

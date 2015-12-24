import {
  Component,
  View,
} from 'angular2/core';

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/common';

import {
  Router,
  RouterLink,
} from 'angular2/router';

import {
  AuthService,
  DbService,
  NavbarService,
} from '../../../services';

import { Subject } from 'rxjs';

import _ = require('lodash');
import moment = require('moment');

import { LogsService } from '../../../services/admin';

import { Log } from '../../../models/admin';

import { TimestampPipe } from '../../../pipes/id';
import { MomentPipe } from '../../../pipes/moment';

import { ReversePipe, FilterPipe, RepeatPipe, PagePipe } from '../../../pipes/collection';

declare var $: any;

@Component({})
@View({
  template: require('./logs.jade'),
  styles: [ ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
    ReversePipe,
    FilterPipe,
    RepeatPipe,
    PagePipe,
  ]
})
export class LogsRoute {
  table: Log[];
  keyword: string;
  field: string;
  startDate: number;
  endDate: number;
  loading: boolean;
  repeater: Subject<any>;
  page: number;

  constructor(private router: Router,
              private auth: AuthService,
              private db: DbService,
              private navbar: NavbarService,
              private logs: LogsService,
              private timestamp: TimestampPipe) {
    if (!auth.check()) return;
    navbar.active('admin/logs');

    $('.ui.dropdown').dropdown();

    this.field = 'all';
    this.loading = true;
    this.repeater = new Subject();
    this.page = 0;

    logs.observable().subscribe(() => this.loading = false);

    logs.refresh();
  }

  setStartDate(date: string) {
    this.startDate = moment(date, 'YYYY-MM-DD').utc().unix() * 1000;
    this.refresh();
  }

  setEndDate(date: string) {
    this.endDate = moment(date, 'YYYY-MM-DD').utc().unix() * 1000 + 24 * 60 * 60 * 1000 - 1;
    this.refresh();
  }

  setKeyword(keyword: string) {
    this.keyword = keyword;
    this.refresh();
  }

  setField(field: string) {
    this.field = field;
    this.refresh();
  }

  refresh() {
    if (this.loading) this.loading = false;
    this.repeater.next(0);
  }

  filter() {
    return (x) => {
      if (!this.keyword) return true;
      switch (this.field) {
        case 'all':
          return x.t.payload.sub.split('/')[0].indexOf(this.keyword) !== -1 ||
            x.q.method.indexOf(this.keyword) !== -1 ||
            x.q.name.indexOf(this.keyword) !== -1;
        case 'user':
          return x.t.payload.sub.split('/')[0].indexOf(this.keyword) !== -1;
        case 'method':
          return x.q.method.indexOf(this.keyword) !== -1;
        case 'collection':
          return x.q.name.indexOf(this.keyword) !== -1;
      }
      return false;
    };
  }

  filterDate() {
    return (x) => {
      let r = true;
      let ts = this.timestamp.transform(x._id);
      if (this.startDate && this.startDate > ts) r = false;
      if (this.endDate && this.endDate < ts) r = false;
      return r;
    };
  }

  nextPage() {
    ++this.page;
  }

  prevPage() {
    if (this.page <= 0) return;
    --this.page;
  }
}

import {
  Component,
  View,
} from 'angular2/core';

import {
  AuthService,
  DbService,
  NavbarService,
} from '../../../services';

import { Subject } from 'rxjs';

import { PaginationComponent } from '../../../components';

import _ = require('lodash');
import moment = require('moment');

import { UsersService } from '../../../services/admin';

import { User } from '../../../models/admin';

import { TimestampPipe, MomentPipe, ReversePipe, FilterPipe, RepeatPipe, PagePipe, CountPipe } from '../../../pipes';

declare var $: any;

@Component({})
@View({
  template: require('./users.jade'),
  styles: [ ],
  directives: [
    //CORE_DIRECTIVES,
    //FORM_DIRECTIVES,
    PaginationComponent,
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
export class UsersRoute {
  keyword: string;
  field: string;
  startDate: number;
  endDate: number;
  loading: boolean;
  repeater: Subject<any>;
  page: number;
  count: number;

  constructor(navbar: NavbarService,
              private users: UsersService,
              private timestamp: TimestampPipe) {

    navbar.active('admin/users');

    $('.ui.dropdown').dropdown();

    this.field = 'all';
    this.loading = true;
    this.repeater = new Subject();
    this.page = 0;
    this.count = 0;

    users.observable().subscribe(r => {
      this.count = r && r.length || 0;
      this.loading = r === null;
    });

    users.refresh();
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
    this.repeater.next(0);
  }

  filter() {
    return x => {
      if (!this.keyword) return true;
      switch (this.field) {
        case 'all':
          return x.name.indexOf(this.keyword) !== -1 ||
            x.enabled.toString().indexOf(this.keyword) !== -1 ||
            x.role.indexOf(this.keyword) !== -1;
        case 'name':
          return x.name.indexOf(this.keyword) !== -1;
        case 'enabled':
          return x.enabled.toString().indexOf(this.keyword) !== -1;
        case 'role':
          return x.role.indexOf(this.keyword) !== -1;
      }
      return false;
    };
  }

  filterDate() {
    return x => {
      let r = true;
      let ts = this.timestamp.transform(x._id);
      if (this.startDate && this.startDate > ts) r = false;
      if (this.endDate && this.endDate < ts) r = false;
      return r;
    };
  }
}

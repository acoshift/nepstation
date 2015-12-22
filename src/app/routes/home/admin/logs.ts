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

import _ = require('lodash');

import { LogsService } from '../../../services/admin';

import { Log } from '../../../models/admin';

import { TimestampPipe } from '../../../pipes/id';
import { MomentPipe } from '../../../pipes/moment';
import { ReversePipe, FilterPipe } from '../../../pipes/collection';

declare var $: any;

@Component({})
@View({
  template: require('./logs.jade'),
  styles: [ '' ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
  ]
})
export class LogsRoute {
  table: Log[];
  keyword: string;
  field: string;

  constructor(private router: Router,
              private auth: AuthService,
              private db: DbService,
              private navbar: NavbarService,
              private logs: LogsService) {
    if (!auth.check()) return;
    navbar.active('admin/logs');
    $('.ui.dropdown').dropdown();

    this.field = 'all';

    logs.observable().subscribe(() => this.refresh());

    logs.refresh();
  }

  refresh(keyword?: string, field?: string) {
    if (typeof keyword !== 'undefined' && keyword !== null) this.keyword = keyword;
    if (typeof field !== 'undefined' && field !== null) this.field = field;
    setTimeout(() => {
      this.table = _(this.logs.data())
        .filter(x => this.filter(x))
        .reverse()
        .value();
    });
  }

  filter(x) {
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
  }
}

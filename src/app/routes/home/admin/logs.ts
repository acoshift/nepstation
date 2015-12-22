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

import { LogsService } from '../../../services/admin';

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
    ReversePipe,
    FilterPipe,
  ]
})
export class LogsRoute {
  table: any[];
  keyword: string;

  constructor(private router: Router,
              private auth: AuthService,
              private db: DbService,
              private navbar: NavbarService,
              private logs: LogsService) {
    //
    if (!auth.check()) return;
    navbar.active('admin/logs');
    $('.ui.dropdown').dropdown();
    this.load();
  }

  load() {
    this.logs.refresh();
  }

  filter(x, keyword) {
    if (!keyword) return true;
    return x.q.name === keyword;
  }
}

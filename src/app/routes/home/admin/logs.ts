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

  constructor(private router: Router,
              private auth: AuthService,
              private db: DbService,
              private navbar: NavbarService) {
    //
    if (!auth.check()) return;
    navbar.active('admin/logs');
    this.load();
  }

  load() {
    this.db.nepq('query', 'db.logs', null, '_id,q{method,name},t{payload{sub}}')
      .subscribe(
        r => {
          this.table = r;
        },
        err => {
          console.log(err);
        }
      );
  }

  filter(x) {
    return x.q.name === 'test.product';
  }
}

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

declare var $: any;

@Component({})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
  ],
  template: require('./logs.jade'),
  styles: [ '' ],
  pipes: [ TimestampPipe, MomentPipe ]
})
export class LogsComponent {
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
          console.log(r);
          this.table = r;
        },
        err => {
          console.log(err);
        }
      );
  }
}

import {
  Component,
  View,
} from 'angular2/core';

import {
  AuthService,
  DbService,
  NavbarService,
} from '../../../services';

@Component({})
@View({
  template: '',
})
export class UsersRoute {
  constructor(auth: AuthService,
              private db: DbService,
              private navbar: NavbarService) {
    if (!auth.check()) return;
    navbar.active('admin/users');
  }
}

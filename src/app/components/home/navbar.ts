import {
  Component,
  View,
} from 'angular2/core';

import {
  CORE_DIRECTIVES,
} from 'angular2/common';

import {
  Router,
  RouterLink,
} from 'angular2/router';

import {
  AuthService,
  NavbarService,
} from '../../services';

declare var $: any;

@Component({
  selector: 'navbar'
})
@View({
  directives: [
    CORE_DIRECTIVES,
    RouterLink
  ],
  template: require('./navbar.html'),
  styles: [ require('./navbar.css') ]
})
export class NavbarComponent {
  activated: string;

  constructor(private router: Router,
              private auth: AuthService,
              private navbar: NavbarService) {
    this.activated = '';
    navbar.onActive(x => this.change(x));
  }

  change(active) {
    this.activated = active;
  }

  isActive(x: string) {
    return this.activated === x;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/Auth']);
  }
}

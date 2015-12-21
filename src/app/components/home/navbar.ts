import {
  Component,
  View,
} from 'angular2/core';

import {
  Router
} from 'angular2/router';

import {
  AuthService
} from '../../services';

declare var $: any;

@Component({
  selector: 'navbar'
})
@View({
  directives: [],
  template: require('./navbar.html'),
  styles: [ require('./navbar.css') ]
})
export class NavbarComponent {
  constructor(private router: Router,
              private auth: AuthService) {
    //
  }

  logout() {
    this.auth.logout();
  }
}

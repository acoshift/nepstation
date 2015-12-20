import {
  Component,
  View,
} from 'angular2/core';

import {
  Router,
} from 'angular2/router';

import {
  NavbarComponent,
} from './navbar';

import {
  AuthService,
} from '../services';

@Component({

})
@View({
  directives: [
    NavbarComponent,
  ],
  template: require('./home.html'),
  styles: [ require('./home.css') ]
})
export class HomeComponent {
  constructor(private router: Router,
              private auth: AuthService) {
    if (!auth.check()) return;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/Auth']);
  }
}

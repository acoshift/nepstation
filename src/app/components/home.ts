import {
  Component,
  View,
} from 'angular2/core';

import {
  Router
} from 'angular2/router';

import {
  AuthService
} from '../services';

@Component({

})
@View({
  directives: [],
  template: '<button (click)="logout()">Logout</button>'
  //template: require('./home.html'),
})
export class HomeComponent {
  constructor(private router: Router,
              private auth: AuthService) { }

  logout() {
    this.auth.logout();
  }
}

import {
  Component,
  View,
  FORM_DIRECTIVES,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

import {
  AuthService
} from '../services';

@Component({

})
@View({
  directives: [FORM_DIRECTIVES],
  template: '<button (click)="logout()">Logout</button>'
  //template: require('./home.html'),
})
export class HomeComponent {
  constructor(private router: Router, private auth: AuthService) {
  }

  logout() {
    this.auth.logout();
  }
}

import {
  Component,
  View,
  FORM_DIRECTIVES,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

@Component({

})
@View({
  directives: [FORM_DIRECTIVES],
  template: '<button (click)="logout()">Logout</button>'
  //template: require('./home.html'),
})
export default class HomeComponent {
  constructor(private router: Router) {
    console.log('home');
  }

  logout() {
    this.router.navigate(['/Auth.Logout'])
  }
}

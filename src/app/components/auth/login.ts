import {
  Component,
  View,
  FORM_DIRECTIVES,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

@Component({
  selector: 'login',
})
@View({
  directives: [FORM_DIRECTIVES],
  template: require('./login.html'),
})
export default class LoginComponent {
  constructor(private router: Router) {
    if (localStorage.getItem('token')) {
      router.navigate(['/Home']);
    }
  }

  private form = {
    user: '',
    pwd: '',
    remember: false
  }

  login() {
    console.log(this.form);
    // TODO: save token to localstorage
    localStorage.setItem('token', 'test-token');
    console.log(localStorage.getItem('token'));
    this.router.navigate(['/Home']);
  }
}

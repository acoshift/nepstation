import {
  Component,
  View,
  FORM_DIRECTIVES,
} from 'angular2/angular2';

@Component({
  selector: 'login-form',
})
@View({
  directives: [FORM_DIRECTIVES],
  template: require('./login.html')
})
export default class LoginForm {
  form = {
    user: '',
    pwd: '',
    remember: false
  }

  login() {
    console.log(this.form);
  }
}

import {
  Component,
  View,
} from 'angular2/core';

import {
  FORM_DIRECTIVES,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/common';

import {
  Router
} from 'angular2/router';

import {
  AuthService
} from '../../services';

@Component({})
@View({
  directives: [FORM_DIRECTIVES],
  template: require('./login.html'),
})
export class LoginComponent {
  form: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {
    this.form = fb.group({
      user: ['', Validators.required],
      pwd: ['', Validators.required],
      remember: [false]
    });
    if (auth.isLoggedIn()) {
      router.navigate(['Home']);
      return;
    }
  }

  login() {
    if (!this.form.valid) return this.invalidInput();
    let { user, pwd, remember } = this.form.value;
    this.auth.login(user, pwd, remember);
  }

  invalidInput() {
    // TODO: show invalid input to user
  }
}

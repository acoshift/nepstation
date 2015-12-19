import {
  Component,
  View,
} from 'angular2/core';

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  FORM_BINDINGS,
  ControlGroup,
  FormBuilder,
  Validators,
  Control,
  AbstractControl,
  NgClass,
} from 'angular2/common';

import {
  Router
} from 'angular2/router';

import {
  AuthService,
} from '../services';

import { FooterComponent } from './footer';

declare var $: any;

@Component({})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    FooterComponent,
  ],
  template: require('./login.html'),
  styles: [ require('./login.css') ],
})
export class LoginComponent {
  loginForm: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {
    // init semantic-ui
    $('.ui.checkbox').checkbox();

    // init model
    this.loginForm = fb.group({
      user: ['', Validators.required],
      pwd: ['', Validators.required],
      remember: [false]
    });

    // check auth
    if (auth.isLoggedIn()) {
      router.navigate(['Home']);
      return;
    }
  }

  login() {
    if (!this.loginForm.valid) return this.invalidInput();
    let { user, pwd, remember } = this.loginForm.value;
    $('.ui.modal').modal('show');
    this.auth.login(user, pwd, remember, success => {
      $('.ui.modal').modal('hide');
      this.router.navigate(['/Home']);
    });
  }

  invalidInput() {
    // TODO: show invalid input to user
  }
}

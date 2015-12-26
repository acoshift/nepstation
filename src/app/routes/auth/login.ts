import { Component, View, Directive } from 'angular2/core';

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/common';

import { AlertComponent } from '../../components';

import { Directives } from '../../directives';

import { Router, RouterLink } from 'angular2/router';
import { AuthService } from '../../services';

declare var $: any;

@Component({})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
    Directives,
    AlertComponent,
  ],
  template: require('./login.jade'),
  styles: [ require('./login.css') ],
})
export class LoginRoute {
  loginForm: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {
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
    if (!this.loginForm.valid) {
      $('.alert').modal('show');
      return;
    }
    let { user, pwd, remember } = this.loginForm.value;
    $('#loading').modal('show');
    this.auth.login(user, pwd, remember, (ok, location) => {
      if (ok) {
        $('#loading').modal('hide');
        if (location) {
          this.router.navigateByUrl(location);
        } else {
          this.router.navigate(['/Home']);
        }
      } else {
        $('#wrong').modal({
          onHide: () => { $('#loading').modal('hide'); }
        }).modal('show');
      }
    });
  }
}

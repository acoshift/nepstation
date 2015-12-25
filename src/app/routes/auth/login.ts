import { Component, View } from 'angular2/core';

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/common';

import { Router, RouterLink } from 'angular2/router';
import { AuthService } from '../../services';

declare var $: any;

@Component({})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
  ],
  template: require('./login.jade'),
  styles: [ require('./login.css') ],
})
export class LoginRoute {
  loginForm: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {
    // init semantic-ui
    $('.ui.checkbox').checkbox();
    $('.modal').modal({ closable: false, allowMultiple: false });

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
      $('#invalid').modal('show');
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

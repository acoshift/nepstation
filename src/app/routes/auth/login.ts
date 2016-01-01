import { Component, View, Directive, ViewChild } from 'angular2/core';

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/common';

import { AlertComponent, IndicatorComponent } from '../../components';
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
    IndicatorComponent,
  ],
  template: require('./login.jade'),
  styles: [ require('./login.css') ],
})
export class LoginRoute {
  loginForm: ControlGroup;

  @ViewChild(AlertComponent)
  private _alert: AlertComponent;

  @ViewChild(IndicatorComponent)
  private _indicator: IndicatorComponent;

  constructor(
    private router: Router,
    private auth: AuthService,
    fb: FormBuilder) {

    // if alredy login, redirect to home
    if (auth.isLoggedIn()) {
      router.navigate(['/Home']);
      return;
    }

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
      this._alert.show({
        title: '',
        content: 'Please input username and password.',
        buttons: [ 'ok' ]
      });
      return;
    }
    let { user, pwd, remember } = this.loginForm.value;
    this._indicator.show();
    this.auth.login(user, pwd, remember).subscribe(
      ({ ok, lastLocation }) => {
        if (ok) {
          this._indicator.hide();
          if (lastLocation) {
            this.router.navigateByUrl(lastLocation);
          } else {
            this.router.navigate(['/Home']);
          }
        } else {
          this._alert.show({
            title: '',
              content: 'Wrong username or password.',
              buttons: [ 'ok' ],
              onHide: () => this._indicator.hide()
          });
        }
      }
    );
  }
}

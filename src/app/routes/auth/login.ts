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
import { EventHandler, Event } from '../../models';

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
export class LoginRoute extends EventHandler {
  loginForm: ControlGroup;

  constructor(
    private router: Router,
    private auth: AuthService,
    fb: FormBuilder) {
    super();
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

  onEvent(event: Event) {
    //
  }

  login() {
    if (!this.loginForm.valid) {
      this.emitter.next({
        name: 'alert',
        data: {
          title: '',
          content: 'Please input username and password.',
          buttons: [ 'ok' ]
        }
      });
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
        this.emitter.next({
          name: 'alert',
          data: {
            title: '',
            content: 'Wrong username or password.',
            buttons: [ 'ok' ],
            onHide: () => $('#loading').modal('hide')
          }
        });
      }
    });
  }
}

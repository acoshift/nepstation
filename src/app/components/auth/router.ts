import {
  Component,
  View,
} from 'angular2/core';

import {
  RouteConfig,
  RouterOutlet,
} from 'angular2/router';

import { LoginComponent } from './login';
import { UsernameComponent } from './forgot/username';
import { PasswordComponent } from './forgot/password';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginComponent, useAsDefault: true },
  { path: '/forgot/username', name: 'ForgotUsername', component: UsernameComponent },
  { path: '/forgot/password', name: 'ForgotPassword', component: PasswordComponent },
])
export class AuthRouter {}

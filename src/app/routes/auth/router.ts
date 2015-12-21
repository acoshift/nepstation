import {
  Component,
  View,
} from 'angular2/core';

import {
  RouteConfig,
  RouterOutlet,
} from 'angular2/router';

import { LoginRoute } from './login';
import { UsernameRoute } from './forgot/username';
import { PasswordRoute } from './forgot/password';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginRoute, useAsDefault: true },
  { path: '/forgot/username', name: 'ForgotUsername', component: UsernameRoute },
  { path: '/forgot/password', name: 'ForgotPassword', component: PasswordRoute },
])
export class AuthRouter {}

import {
  Component,
  View,
} from 'angular2/core';

import {
  RouteConfig,
  RouterOutlet,
} from 'angular2/router';

import { LogsRoute } from './logs';
import { UsersRoute } from './users';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/logs', name: 'Logs', component: LogsRoute },
  { path: '/users', name: 'Users', component: UsersRoute },
])
export class AdminRouter {}

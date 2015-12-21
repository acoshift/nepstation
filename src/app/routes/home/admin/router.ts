import {
  Component,
  View,
} from 'angular2/core';

import {
  RouteConfig,
  RouterOutlet,
} from 'angular2/router';

import { LogsRoute } from './logs';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/logs', name: 'Logs', component: LogsRoute },
])
export class AdminRouter {}

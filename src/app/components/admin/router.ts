import {
  Component,
  View,
} from 'angular2/core';

import {
  RouteConfig,
  RouterOutlet,
} from 'angular2/router';

import { LogsComponent } from './logs';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/logs', name: 'Logs', component: LogsComponent },
])
export class AdminRouter {}

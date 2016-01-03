import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { CollectorsRoute } from './routes/collectors';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/collectors', name: 'Collectors', component: CollectorsRoute },
])
export class Router {}

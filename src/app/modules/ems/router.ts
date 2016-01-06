import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { StaffsRoute } from './routes/staffs';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/staffs', name: 'Staffs', component: StaffsRoute },
])
export class Router {}

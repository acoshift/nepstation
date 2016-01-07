import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { StaffsRoute } from './routes/staffs';
import { TasksRoute } from './routes/tasks';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/staffs', name: 'Staffs', component: StaffsRoute },
  { path: '/tasks', name: 'Tasks', component: TasksRoute },
])
export class Router {}

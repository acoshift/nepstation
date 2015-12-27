import { Component, View } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { LogsRoute } from './logs';
import { UsersRoute } from './users';
import { RolesRoute } from './roles';
import { TrashRoute } from './trash';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/logs', name: 'Logs', component: LogsRoute },
  { path: '/users', name: 'Users', component: UsersRoute },
  { path: '/roles', name: 'Roles', component: RolesRoute },
  { path: '/trash', name: 'Trash', component: TrashRoute },
])
export class AdminRouter {}

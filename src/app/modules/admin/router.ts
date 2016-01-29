import { Component } from 'angular2/core'
import { RouteConfig, RouterOutlet } from 'angular2/router'
import { LogsRoute } from './routes/logs'
import { RolesRoute } from './routes/roles'
import { TrashRoute } from './routes/trash'
import { UsersRoute } from './routes/users'

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/logs', name: 'Logs', component: LogsRoute },
  { path: '/roles', name: 'Roles', component: RolesRoute },
  { path: '/trash', name: 'Trash', component: TrashRoute },
  { path: '/users', name: 'Users', component: UsersRoute },
])
export class Router {}

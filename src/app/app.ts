import { Component } from 'angular2/core'
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router'
import { AuthRouter } from './routes/auth/router'
import { HomeRouter } from './routes/home/router'

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  directives: [
    ...ROUTER_DIRECTIVES,
  ],
})
@RouteConfig([
  { path: '/auth/...', name: 'Auth', component: AuthRouter },
  { path: '/home/...', name: 'Home', component: HomeRouter, useAsDefault: true },
  { path: '/**', redirectTo: ['/Home'] }
])
export class App {}

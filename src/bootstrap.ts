require('!style!css!./app/style.css')

import {
  Component,
  provide,
} from 'angular2/core'

import {
  bootstrap,
} from 'angular2/bootstrap'

import {
  ELEMENT_PROBE_PROVIDERS,
} from 'angular2/platform/browser'

import {
  RouteConfig,
  LocationStrategy,
  PathLocationStrategy,
  RouterOutlet,
  ROUTER_PROVIDERS,
  ROUTER_PRIMARY_COMPONENT,
} from 'angular2/router'

import {
  HTTP_PROVIDERS,
} from 'angular2/http'

import {
  Services,
} from './app/services'

import { Pipes } from './app/pipes'

import { AuthRouter } from './app/routes/auth/router'
import { HomeRouter } from './app/routes/home/router'

import { Services as ModuleServices } from './app/modules'

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  directives: [
    RouterOutlet,
  ],
})
@RouteConfig([
  { path: '/auth/...', name: 'Auth', component: AuthRouter },
  { path: '/home/...', name: 'Home', component: HomeRouter, useAsDefault: true },
  { path: '/**', redirectTo: ['/Home'] }
])
class App {}

bootstrap(App, [
  ('production' === process.env.ENV ? [] : ELEMENT_PROBE_PROVIDERS),
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: App }),
  Services,
  Pipes,
  ModuleServices,
])
.catch(err => console.error(err))

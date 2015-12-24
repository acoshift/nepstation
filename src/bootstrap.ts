require('!style!css!./app/style.css');

import {
  Component,
  provide,
  enableProdMode,
} from 'angular2/core';

import {
  bootstrap,
} from 'angular2/bootstrap';

import {
  FORM_PROVIDERS,
} from 'angular2/common';

import {
  ELEMENT_PROBE_PROVIDERS,
} from 'angular2/platform/browser';

import {
  RouteConfig,
  LocationStrategy,
  PathLocationStrategy,
  RouterOutlet,
  ROUTER_PROVIDERS,
  ROUTER_PRIMARY_COMPONENT,
  Router,
} from 'angular2/router';

import {
  HTTP_PROVIDERS,
} from 'angular2/http';

import {
  AuthService,
  Services,
} from './app/services';

import { Pipes } from './app/pipes';

import { AuthRouter } from './app/routes/auth/router';
import { HomeRouter } from './app/routes/home/router';

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
  { path: '**', redirectTo: ['/Home'] }
])
class App {}

// enableProdMode() // include for production builds
bootstrap(App, [
  FORM_PROVIDERS,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS, // remove in production
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: App }),
  Services,
  Pipes,
]);

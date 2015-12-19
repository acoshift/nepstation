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
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  ROUTER_PRIMARY_COMPONENT,
  Router,
} from 'angular2/router';

import {
  HTTP_PROVIDERS,
} from 'angular2/http';

import {
  AppRoutes,
  HeaderComponent,
  FooterComponent,
} from './app/components';

import {
  AuthService,
  AppServices,
} from './app/services';

@Component({
  selector: 'app',
  template: `<header></header><router-outlet></router-outlet><footer></footer>`,
  styles: [ ],
  directives: [
    ROUTER_DIRECTIVES,
    HeaderComponent,
    FooterComponent,
  ],
})
@RouteConfig(AppRoutes)
class App {
  constructor(private router: Router,
              private auth: AuthService) {
    if (!auth.check()) return;
  }
}

// enableProdMode() // include for production builds
bootstrap(App, [
  FORM_PROVIDERS,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS, // remove in production
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: App }),
  AppServices,
]);

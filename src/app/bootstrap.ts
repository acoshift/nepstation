require('bootstrap/dist/css/bootstrap.min.css');
//require('script!bootstrap/dist/js/bootstrap.min.js');

import {
  Component,
  provide,
  Inject,
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
} from './components';

import {
  AuthService,
  AppServices,
} from './services';

@Component({
  selector: 'app',
  template: `<header></header><router-outlet></router-outlet><footer></footer>`,
  directives: [
    ROUTER_DIRECTIVES,
    HeaderComponent,
    FooterComponent,
  ],
})
@RouteConfig(AppRoutes)
class App {
  constructor(@Inject(Router) private router: Router,
              @Inject(AuthService) private auth: AuthService) {
    if (!auth.check()) return;
  }
}

bootstrap(App, [
  FORM_PROVIDERS,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: App }),
  AppServices,
]);

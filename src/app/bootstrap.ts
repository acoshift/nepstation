import {
  bootstrap,
  Component,
  provide,
  FORM_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS,
  Inject,
} from 'angular2/angular2';

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
  AppRoutes
} from './components';

import {
  AuthService,
  AppServices,
} from './services';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  directives: [ ROUTER_DIRECTIVES ],
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

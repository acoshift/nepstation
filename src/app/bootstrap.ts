/// <reference path="../../node_modules/angular2/angular2.d.ts" />

import {
  bootstrap,
  Component,
  provide,
  FORM_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS,
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

import HomeComponent from './components/home';
import LoginComponent from './components/auth/login';
import LogoutComponent from './components/auth/logout';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`,
  directives: [ ROUTER_DIRECTIVES ],
})
@RouteConfig([
  { path: '/home', as: 'Home', component: HomeComponent },
  { path: '/auth/login', as: 'Auth.Login', component: LoginComponent },
  { path: '/auth/logout', as: 'Auth.Logout', component: LogoutComponent },
])
class App {
  constructor(private router: Router) {
    console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token'))
      router.navigate(['/Auth.Login']);
    else
      router.navigate(['/Home']);
  }
}

bootstrap(App, [
  FORM_PROVIDERS,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide(ROUTER_PRIMARY_COMPONENT, { useValue: App }),
]);

import {
  Component,
  View,
} from 'angular2/core';

import {
  Router,
  RouteConfig,
  RouterOutlet,
} from 'angular2/router';

import {
  NavbarComponent,
} from './navbar';

import {
  AuthService,
} from '../../services';

import { IndexComponent } from './index';
import { AdminRouter } from './admin/router';

@Component({

})
@View({
  directives: [
    NavbarComponent,
    RouterOutlet,
  ],
  template: require('./router.html'),
  styles: [ require('./router.css') ]
})
@RouteConfig([
  { path: '/', name: 'Index', component: IndexComponent, useAsDefault: true },
  { path: '/admin/...', name: 'Admin', component: AdminRouter },
])
export class HomeRouter {
  constructor(private router: Router,
              private auth: AuthService) {
    if (!auth.check()) return;
  }
}

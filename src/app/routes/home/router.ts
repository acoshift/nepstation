import { Component, View } from 'angular2/core';
import { Router, RouteConfig, RouterOutlet } from 'angular2/router';
import { NavbarComponent } from '../../components';
import { AuthService } from '../../services';

import { IndexRoute } from './index';
import { AdminRouter } from './admin/router';
import { CommonRouter } from './common/router';
import { CollectionRouter } from './collection/router';
import { StockRouter } from './stock/router';

@Component({})
@View({
  directives: [
    NavbarComponent,
    RouterOutlet,
  ],
  template: require('./router.jade'),
  styles: [ require('./router.css') ]
})
@RouteConfig([
  { path: '/', name: 'Index', component: IndexRoute, useAsDefault: true },
  { path: '/admin/...', name: 'Admin', component: AdminRouter },
  { path: '/common/...', name: 'Common', component: CommonRouter },
  { path: '/collection/...', name: 'Collection', component: CollectionRouter },
  { path: '/stock/...', name: 'Stock', component: StockRouter },
])
export class HomeRouter {
  constructor(auth: AuthService) {
    if (!auth.check()) return;
  }
}

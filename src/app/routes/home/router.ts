import { Component, View } from 'angular2/core'
import { Router, RouteConfig, RouterOutlet } from 'angular2/router'
import { NavbarComponent } from '../../components'
import { AuthService } from '../../services'

import { IndexRoute } from './index'

import { Router as AdminRouter } from '../../modules/admin/router'
import { Router as SaleRouter } from '../../modules/sale/router'
import { Router as CollectionRouter } from '../../modules/collection/router'
import { Router as StockRouter } from '../../modules/stock/router'
import { Router as EmsRouter } from '../../modules/ems/router'

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
  { path: '/sale/...', name: 'Sale', component: SaleRouter },
  { path: '/collection/...', name: 'Collection', component: CollectionRouter },
  { path: '/stock/...', name: 'Stock', component: StockRouter },
  { path: '/ems/...', name: 'Ems', component: EmsRouter },
])
export class HomeRouter {
  constructor (auth: AuthService) {
    if (!auth.check()) return
  }
}

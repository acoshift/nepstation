import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { ProductUnitsRoute } from './product_units';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/product_units', name: 'ProductUnits', component: ProductUnitsRoute },
])
export class StockRouter {}

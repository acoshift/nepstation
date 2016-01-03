import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { ProductUnitsRoute } from './routes/product_units';
import { ProductTypesRoute } from './routes/product_types';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/product_units', name: 'ProductUnits', component: ProductUnitsRoute },
  { path: '/product_types', name: 'ProductTypes', component: ProductTypesRoute },
])
export class Router {}

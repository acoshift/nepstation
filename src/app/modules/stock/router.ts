import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { ProductsRoute } from './routes/products';
import { ProductBrandsRoute } from './routes/product_brands';
import { ProductGroupsRoute } from './routes/product_groups';
import { ProductUnitsRoute } from './routes/product_units';
import { ProductTypesRoute } from './routes/product_types';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/products', name: 'Products', component: ProductsRoute },
  { path: '/product_brands', name: 'ProductBrands', component: ProductBrandsRoute },
  { path: '/product_groups', name: 'ProductGroups', component: ProductGroupsRoute },
  { path: '/product_units', name: 'ProductUnits', component: ProductUnitsRoute },
  { path: '/product_types', name: 'ProductTypes', component: ProductTypesRoute },
])
export class Router {}

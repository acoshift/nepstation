import { Component, View } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { CustomersRoute } from './customers';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/customers', name: 'Customers', component: CustomersRoute },
])
export class SaleRouter {}

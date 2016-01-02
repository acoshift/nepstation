import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { CustomersRoute } from './customers';
import { CustomerTypesRoute } from './customer_types';

@Component({
  template: '<router-outlet></router-outlet>',
  directives: [ RouterOutlet ]
})
@RouteConfig([
  { path: '/customers', name: 'Customers', component: CustomersRoute },
  { path: '/customer_types', name: 'CustomerTypes', component: CustomerTypesRoute },
])
export class CommonRouter {}

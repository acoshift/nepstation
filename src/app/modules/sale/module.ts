/* Models */
export * from './models/customer';
export * from './models/customer_type';

/* Services */
export * from './services/customer_types';
export * from './services/customers';

import { CustomerTypesService } from './services/customer_types';
import { CustomersService } from './services/customers';

export var Services = [
  CustomerTypesService,
  CustomersService,
];

/* Router */
export * from './router';

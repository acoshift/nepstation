export * from './common/customers';
export * from './common/customer_types';

import { CustomersService } from './common/customers';
import { CustomerTypesService } from './common/customer_types';

export var Services = [
  CustomersService,
  CustomerTypesService,
];

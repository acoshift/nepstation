/* Models */
export * from './models/product';
export * from './models/product_group';
export * from './models/product_type';
export * from './models/product_unit';

/* Services */
export * from './services/product_groups';
export * from './services/product_types';
export * from './services/product_units';

import { ProductGroupsService } from './services/product_groups';
import { ProductTypesService } from './services/product_types';
import { ProductUnitsService } from './services/product_units';

export var Services = [
  ProductGroupsService,
  ProductTypesService,
  ProductUnitsService,
];

/* Router */
export * from './router';

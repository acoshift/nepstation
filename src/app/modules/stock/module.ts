/* Models */
export * from './models/product';
export * from './models/product_type';
export * from './models/product_unit';

/* Services */
export * from './services/product_types';
export * from './services/product_units';

import { ProductTypesService } from './services/product_types';
import { ProductUnitsService } from './services/product_units';

export var Services = [
  ProductTypesService,
  ProductUnitsService,
];

/* Router */
export * from './router';

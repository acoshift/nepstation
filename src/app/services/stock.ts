export * from './stock/product_units';
export * from './stock/product_types';

import { ProductUnitsService } from './stock/product_units';
import { ProductTypesService } from './stock/product_types';

export var Services = [
  ProductUnitsService,
  ProductTypesService,
];

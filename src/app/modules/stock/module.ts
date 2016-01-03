/* Models */
export * from './models/product';
export * from './models/product_brand';
export * from './models/product_group';
export * from './models/product_type';
export * from './models/product_unit';

/* Services */
export * from './services/product_brands';
export * from './services/product_groups';
export * from './services/product_types';
export * from './services/product_units';

import { ProductBrandsService } from './services/product_brands';
import { ProductGroupsService } from './services/product_groups';
import { ProductTypesService } from './services/product_types';
import { ProductUnitsService } from './services/product_units';

export var Services = [
  ProductBrandsService,
  ProductGroupsService,
  ProductTypesService,
  ProductUnitsService,
];

/* Router */
export * from './router';

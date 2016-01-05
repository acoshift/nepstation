/* Models */
export * from './models/product';
export * from './models/product_brand';
export * from './models/product_group';
export * from './models/product_type';
export * from './models/product_unit';
export * from './models/warehouse';

/* Services */
export * from './services/products';
export * from './services/product_brands';
export * from './services/product_groups';
export * from './services/product_types';
export * from './services/product_units';
export * from './services/warehouses';

import { ProductsService } from './services/products';
import { ProductBrandsService } from './services/product_brands';
import { ProductGroupsService } from './services/product_groups';
import { ProductTypesService } from './services/product_types';
import { ProductUnitsService } from './services/product_units';
import { WarehousesService } from './services/warehouses';

export var Services = [
  ProductsService,
  ProductBrandsService,
  ProductGroupsService,
  ProductTypesService,
  ProductUnitsService,
  WarehousesService,
];

/* Router */
export * from './router';

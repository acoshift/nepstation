export * from './services/db';
export * from './services/auth';
export * from './services/navbar';
export * from './services/cache';
export * from './services/admin';
export * from './services/common';

import { DbService } from './services/db';
import { AuthService } from './services/auth';
import { NavbarService } from './services/navbar';
import { CacheService } from './services/cache';
import { Services as AdminServices } from './services/admin';
import { Services as CommonServices} from './services/common';
import { Services as CollectionServices } from './services/collection';

export var Services = [
  DbService,
  AuthService,
  NavbarService,
  CacheService,
  AdminServices,
  CommonServices,
  CollectionServices,
];

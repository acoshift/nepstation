export * from './services/db';
export * from './services/auth';
export * from './services/navbar';
export * from './services/cache';

import { DbService } from './services/db';
import { AuthService } from './services/auth';
import { NavbarService } from './services/navbar';
import { CacheService } from './services/cache';
import { Services as AdminServices } from './services/admin';

export var Services = [
  DbService,
  AuthService,
  NavbarService,
  CacheService,
  AdminServices,
];

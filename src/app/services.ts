export * from './services/auth';
export * from './services/cache';
export * from './services/db';
export * from './services/model';
export * from './services/navbar';
export * from './services/readonlymodel';

import { DbService } from './services/db';
import { AuthService } from './services/auth';
import { NavbarService } from './services/navbar';
import { CacheService } from './services/cache';

export var Services = [
  DbService,
  AuthService,
  NavbarService,
  CacheService,
];

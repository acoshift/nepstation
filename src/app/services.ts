export * from './services/db';
export * from './services/auth';
export * from './services/navbar';

import { DbService } from './services/db';
import { AuthService } from './services/auth';
import { NavbarService } from './services/navbar';

export var AppServices = [
  DbService,
  AuthService,
  NavbarService,
];

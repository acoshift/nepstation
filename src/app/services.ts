export * from './services/db';
export * from './services/auth';

import { DbService } from './services/db';
import { AuthService } from './services/auth';

export var AppServices = [
  DbService,
  AuthService,
];

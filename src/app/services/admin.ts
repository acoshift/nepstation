export * from './admin/logs';
export * from './admin/users';

import { LogsService } from './admin/logs';
import { UsersService } from './admin/users';

export var Services = [
  LogsService,
  UsersService,
];

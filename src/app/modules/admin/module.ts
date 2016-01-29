/* Models */
export * from './models/log'
export * from './models/role'
export * from './models/trash'
export * from './models/user'

/* Services */
export * from './services/logs'
export * from './services/roles'
export * from './services/trash'
export * from './services/users'

import { LogsService } from './services/logs'
import { RolesService } from './services/roles'
import { TrashService } from './services/trash'
import { UsersService } from './services/users'

export var Services = [
  LogsService,
  RolesService,
  TrashService,
  UsersService,
]

/* Router */
export * from './router'

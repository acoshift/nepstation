/* Models */
export * from './models/staff'
export * from './models/task'

/* Services */
export * from './services/staffs'
export * from './services/tasks'

import { StaffsService } from './services/staffs'
import { TasksService } from './services/tasks'

export var Services = [
  StaffsService,
  TasksService,
]

/* Router */
export * from './router'

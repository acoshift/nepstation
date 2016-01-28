import { User } from '../../admin/module'

export interface Staff extends User {
  code: string
  fullname: string
  phone: string
  email: string
  quota: number
  _taskCount?: number
}

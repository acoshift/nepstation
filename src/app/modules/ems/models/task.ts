import { Operatable } from '../../../models'

export interface Task extends Operatable {
  code: string
  staff: string /* _id of Staff */
  result: any
  status: string
}

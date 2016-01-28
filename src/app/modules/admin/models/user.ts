import { Operatable } from '../../../models'

export interface User extends Operatable {
  name: string
  pwd: string
  enabled: boolean
  role: string
}

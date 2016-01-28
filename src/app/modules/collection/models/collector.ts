import { Operatable } from '../../../models'

export interface Collector extends Operatable {
  code: string
  name: string
  phone: string
  email: string
  quota: number
}

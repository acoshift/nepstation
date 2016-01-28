import { Operatable } from '../../../models'

export interface Customer extends Operatable {
  name: string
  gender: string
  type: string
  phone: string
}

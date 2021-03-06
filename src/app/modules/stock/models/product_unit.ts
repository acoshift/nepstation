import { Operatable } from '../../../models'

export interface ProductUnit extends Operatable {
  name: string
  remark: string
  base: string
  baseAmount: number
}

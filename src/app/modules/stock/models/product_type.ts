import { Operatable } from '../../../models'

export interface ProductType extends Operatable {
  name: string
  remark: string
  _productCount?: number
}

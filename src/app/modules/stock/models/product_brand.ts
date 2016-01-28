import { Operatable } from '../../../models'

export interface ProductBrand extends Operatable {
  name: string
  remark: string
  _productCount?: number
}

import { Injectable } from 'angular2/core'
import { DbService, ModelService } from '../../../services'
import { ProductUnit } from '../models/product_unit'

@Injectable()
export class ProductUnitsService extends ModelService<ProductUnit> {
  constructor (db: DbService) {
    super(db, 'stock.product_units', {
      refresh: {
        _id: 1, name: 1, base: 1, baseAmount: 1
      },
      read: {
        _id: 1, name: 1, remark: 1, base: 1, baseAmount: 1
      }
    })
  }

  preSubmit (item: ProductUnit) {
    if (!!item.base) {
      item.$id = { base: item.base }
      delete item.base
    }

    return item
  }
}

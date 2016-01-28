import { Injectable } from 'angular2/core'
import { DbService, ModelService } from '../../../services'
import { Product } from '../models/product'

@Injectable()
export class ProductsService extends ModelService<Product> {
  constructor (db: DbService) {
    super(db, 'stock.products', {
      refresh: {
        _id: 1, name: 1, unit: 1, group: 1, brand: 1, price: 1, point: 1
      },
      read: null
    })
  }

  preSubmit (item: Product) {
    item.$id = {}

    if (!!item.brand) {
      item.$id.brand = item.brand
      delete item.brand
    }
    if (!!item.group) {
      item.$id.group = item.group
      delete item.group
    }

    return item
  }
}

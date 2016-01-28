import { Injectable } from 'angular2/core'
import { Observable } from 'rxjs'
import { DbService, ModelService } from '../../../services'
import { ProductGroup } from '../models/product_group'

@Injectable()
export class ProductGroupsService extends ModelService<ProductGroup> {
  constructor (db: DbService) {
    super(db, 'stock.product_groups', {
      refresh: {
        _id: 1, name: 1, type: 1
      },
      read: {
        _id: 1, name: 1, type: 1, remark: 1
      }
    })
  }

  refresh (): Observable<ProductGroup[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh)
      .do((xs: ProductGroup[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'stock.products', { $id: { group: v._id } }, null)
            .subscribe(result => v._productCount = result)
        })
      })
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    )
    return t
  }

  preSubmit (item: ProductGroup) {
    if (!!item.type) {
      item.$id = { type: item.type }
      delete item.type
    }

    return item
  }
}

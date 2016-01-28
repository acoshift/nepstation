import { Injectable } from 'angular2/core'
import { Observable } from 'rxjs'
import { DbService, ModelService } from '../../../services'
import { CustomerType } from '../models/customer_type'
import * as _ from 'lodash'

@Injectable()
export class CustomerTypesService extends ModelService<CustomerType> {
  constructor (db: DbService) {
    super(db, 'sale.customer_types', {
      refresh: {
        _id: 1, name: 1
      },
      read: {
        _id: 1, name: 1, remark: 1
      }
    })
  }

  refresh (): Observable<CustomerType[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh)
      .do((xs: CustomerType[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'sale.customers', { $id: { type: v._id } }, null)
            .subscribe(result => v._customerCount = result)
        })
      })
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    )
    return t
  }
}

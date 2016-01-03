import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService } from '../db';
import { ModelService } from '../model';
import { CustomerType } from '../../models';
import _ = require('lodash');

@Injectable()
export class CustomerTypesService extends ModelService<CustomerType> {
  constructor(db: DbService) {
    super(db, 'common.customer_types', {
      refresh: {
        _id: 1, name: 1
      },
      read: {
        _id: 1, name: 1, remark: 1
      }
    });
  }

  refresh(): Observable<CustomerType[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh)
      .do((xs: CustomerType[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'common.customers', { $id: { type: v._id } }, null)
            .subscribe(result => v._customerCount = result);
        });
      });
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }
}

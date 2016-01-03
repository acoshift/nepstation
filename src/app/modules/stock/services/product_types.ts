import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService, ModelService } from '../../../services';
import { ProductType } from '../models/product_type';

@Injectable()
export class ProductTypesService extends ModelService<ProductType> {
  constructor(db: DbService) {
    super(db, 'stock.product_types', {
      refresh: {
        _id: 1, name: 1
      },
      read: {
        _id: 1, name: 1, remark: 1
      }
    });
  }

  refresh(): Observable<ProductType[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh)
      .do((xs: ProductType[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'stock.products', { $id: { type: v._id } }, null)
            .subscribe(result => v._productCount = result);
        });
      });
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }
}

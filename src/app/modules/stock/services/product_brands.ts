import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService, ModelService } from '../../../services';
import { ProductBrand } from '../models/product_brand';

@Injectable()
export class ProductBrandsService extends ModelService<ProductBrand> {
  constructor(db: DbService) {
    super(db, 'stock.product_brands', {
      refresh: {
        _id: 1, name: 1
      },
      read: {
        _id: 1, name: 1, remark: 1
      }
    });
  }

  refresh(): Observable<ProductBrand[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh)
      .do((xs: ProductBrand[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'stock.products', { $id: { group: v._id } }, null)
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

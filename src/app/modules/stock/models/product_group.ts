import { Operatable } from '../../../models';

export interface ProductGroup extends Operatable {
  name: string;
  remark: string;
  _productCount?: number;
}

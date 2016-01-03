import { Operatable } from '../operatable';

export interface ProductType extends Operatable {
  name: string;
  remark: string;
  _productCount?: number;
}

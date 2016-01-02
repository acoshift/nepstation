import { Operatable } from '../operatable';

export interface ProductType extends Operatable {
  name: string;
  remark: string;
  productCount?: number;
}

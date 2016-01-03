import { Operatable } from '../../../models';

export interface Product extends Operatable {
  name: string;
  remark: string;
  unit: string;
  group: string;
  brand: string;
  price: number;
  point: number;
}

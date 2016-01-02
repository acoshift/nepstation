import { Operatable } from '../operatable';

export interface Product extends Operatable {
  name: string;
  remark: string;
  unit: string;
  type: string;
}

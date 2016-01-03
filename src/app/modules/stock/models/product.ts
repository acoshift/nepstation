import { Operatable } from '../../../models';

export interface Product extends Operatable {
  name: string;
  remark: string;
  unit: string;
  type: string;
}

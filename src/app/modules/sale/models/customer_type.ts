import { Operatable } from '../../../models';

export interface CustomerType extends Operatable {
  name: string;
  remark: string;
  _customerCount?: number;
}

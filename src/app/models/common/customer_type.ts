import { Operatable } from '../operatable';

export interface CustomerType extends Operatable {
  name: string;
  remark: string;
  customerCount: number;
}

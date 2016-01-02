import { Operatable } from '../operatable';

export interface ProductUnit extends Operatable {
  name: string;
  remark: string;
  base: string;
  baseAmount: number;
}

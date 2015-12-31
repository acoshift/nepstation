import { Operatable } from '../operatable';

export interface Customer extends Operatable {
  name: string;
  gender: string;
}

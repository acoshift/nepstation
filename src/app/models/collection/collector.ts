import { Operatable } from '../operatable';

export interface Collector extends Operatable {
  code: string;
  name: string;
  phone: string;
  email: string;
  quota: number;
}

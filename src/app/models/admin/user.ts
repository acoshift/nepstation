import { Operatable } from '../operatable';

export interface User extends Operatable {
  name: string;
  pwd: string;
  enabled: boolean;
  role: string;
}

import { Operatable } from '../operatable';

export interface User extends Operatable {
  _id: string;
  name: string;
  pwd: string;
  enabled: boolean;
  role: string;
}

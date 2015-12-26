import { Operatable } from '../operatable';

export interface Role extends Operatable {
  _id: string;
  name: string;
  dbs: any;
}

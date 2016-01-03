import { Operatable } from '../../../models';

export interface Role extends Operatable {
  name: string;
  dbs: any;
  _userCount?: number;
}

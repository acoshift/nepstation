import { Id } from './id';

export interface Operatable extends Id {
  $id?: any;
  $bcrypt?: any;
  $date?: any;
}

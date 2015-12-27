import { Id } from './id';

export interface Operatable extends Id {
  $id;
  $bcrypt;
  $date;
}

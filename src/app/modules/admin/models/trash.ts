import { Id } from '../../../models';

export interface Trash extends Id {
  db: string;
  data: any;
}

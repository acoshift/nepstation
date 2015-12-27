import { Id } from '../id';

export interface Trash extends Id {
  db: string;
  data: any;
}

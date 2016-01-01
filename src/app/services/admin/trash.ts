import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService } from '../db';
import { ReadOnlyModelService } from '../readonlymodel';
import { Trash } from '../../models';

@Injectable()
export class TrashService extends ReadOnlyModelService<Trash> {
  constructor(db: DbService) {
    super(db, 'db.trash', {
      refresh: { _id: 1, db: 1 },
      read: null,
      restore: null
    });
  }

  refresh(): Observable<Trash[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh);
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }

  restore(id: string | string[]): Observable<any> {
    return this.db.request('restore', '', id, this.retrieves.restore);
  }
}

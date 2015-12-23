import { Injectable } from 'angular2/core';
import * as Rx from 'rxjs';
import { DbService } from '../db';
import { ReadOnlyModelService } from '../../models/services';
import { Log } from '../../models/admin';

@Injectable()
export class LogsService implements ReadOnlyModelService<Log[]> {
  private logs: Rx.Observable<Log[]>;
  private log: Rx.Subject<Log[]>;

  constructor(private db: DbService) {
    this.log = new Rx.BehaviorSubject([]);
    this.logs = this.log.share();
  }

  refresh() {
    this.db.nepq('query', 'db.logs', [{}, {limit: 30}], {
      _id: 1,
      q: { method: 1, name: 1 },
      t: { payload: { sub: 1 } } })
    .subscribe(
      r => {
        if (r.error) return this.log.error(r.error);
        this.log.next(r);
      },
      e => this.log.error(e)
    );
  }

  observable() {
    return this.logs;
  }
}

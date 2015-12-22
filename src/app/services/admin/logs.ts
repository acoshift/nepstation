import { Injectable } from 'angular2/core';
import * as Rx from 'rxjs';
import { DbService } from '../db';
import { ReadOnlyModelService } from '../../models/services';
import { Log } from '../../models/admin';

@Injectable()
export class LogsService implements ReadOnlyModelService<Log> {
  private logs: Rx.Observable<Log[]>;
  private log: Rx.Subject<Log[]>;
  private logData: Log[];

  constructor(private db: DbService) {
    this.log = new Rx.Subject();
    this.logs = this.log.share();
    this.logData = [];
  }

  refresh() {
    this.db.nepq('query', 'db.logs', null, {
      _id: 1,
      q: { method: 1, name: 1 },
      t: { payload: { sub: 1 } } })
    .subscribe(
      r => {
        if (r.error) return this.log.error(r.error);
        this.logData = r;
        this.log.next(r);
      },
      e => this.log.error(e)
    );
  }

  observable() {
    return this.logs;
  }

  data() {
    return this.logData;
  }
}

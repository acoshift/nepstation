import { Injectable } from 'angular2/core';
import { DbService } from '../db';
import { ReadOnlyModelService } from '../../models/services';
import { Log } from '../../models/admin';

@Injectable()
export class LogsService implements ReadOnlyModelService<Log> {
  logs: Log[] = [];

  constructor(private db: DbService) { }

  refresh() {
    return new Promise((reslove, reject) => {
      this.db.nepq('query', 'db.logs', null, {
        _id: 1,
        q: { method: 1, name: 1 },
        t: { payload: { sub: 1 } } })
      .subscribe(
        r => {
          if (r.error) return reject(r.error);
          this.logs = r;
        },
        e => reject(e)
      );
    });
  }

  data() {
    return this.logs;
  }
}

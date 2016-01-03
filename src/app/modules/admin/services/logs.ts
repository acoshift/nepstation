import { Injectable } from 'angular2/core';
import { DbService, ReadOnlyModelService } from '../../../services';
import { Log } from '../models/log';

@Injectable()
export class LogsService extends ReadOnlyModelService<Log> {
  constructor(db: DbService) {
    super(db, 'db.logs', {
      refresh: {
        _id: 1,
        q: { method: 1, name: 1 },
        t: { payload: { name: 1 } }
      },
      read: null
    });
  }
}

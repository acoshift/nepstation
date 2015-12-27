import { Injectable } from 'angular2/core';
import { DbService } from '../db';
import { ReadOnlyModelService } from '../readonlymodel';
import { Log } from '../../models';

@Injectable()
export class LogsService extends ReadOnlyModelService<Log> {
  constructor(db: DbService) {
    super(db, 'db.logs', {
      refresh: {
        _id: 1,
        q: { method: 1, name: 1 },
        t: { payload: { name: 1 } }
      },
      read: {
        _id: 1, name: 1, enabled: 1, role: 1
      }
    });
  }
}

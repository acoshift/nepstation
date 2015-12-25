import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from '../db';
import { ReadOnlyModelService, Log } from '../../models';

@Injectable()
export class LogsService implements ReadOnlyModelService<Log> {
  private log: Subject<Log[]> = new BehaviorSubject(null);
  private logs: Observable<Log[]> = this.log.share();

  constructor(private db: DbService) { }

  refresh() {
    this.db.nepq('query', 'db.logs', null, {
      _id: 1,
      q: { method: 1, name: 1 },
      t: { payload: { sub: 1 } } }
    ).subscribe(
      r => {
        if (r.error) return this.log.error(r.error);
        this.log.next(r);
      },
      e => { ; }//this.log.error(e)
    );
  }

  list() {
    return this.logs;
  }

  read(id: string): Observable<Log> {
    return this.db.nepq('query', 'db.logs', id, null);
  }
}

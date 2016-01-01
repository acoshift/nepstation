import { DbService } from './db';
import { Observable } from 'rxjs';
import { ModelService } from './model';

export class ReadOnlyModelService<T> extends ModelService<T> {
  constructor(
    protected db: DbService,
    protected namespace: string,
    protected retrieves: any) { super(db, namespace, retrieves); }

  refresh(): Observable<T[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh, true);
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }

  submit(item: T): Observable<any> {
    return Observable.throw(new Error('Read-only model can not submit'));
  }

  delete(id: string | string[]): Observable<any> {
    return Observable.throw(new Error('Read-only model can not delete'));
  }
}

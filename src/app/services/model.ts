import { DbService } from './db';
import { Observable, Subject, ConnectableObservable } from 'rxjs';

export abstract class ModelService<T> {
  protected _list: Subject<T[]>;

  constructor(
    protected db: DbService,
    protected namespace: string,
    protected retrieves: any) {

    this._list = new Subject();
    this.list = this._list.publishBehavior([]);
    this.list.connect();
  }

  list: ConnectableObservable<T[]>;

  refresh(): Observable<T[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh);
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }

  read(id: string): Observable<T> {
    return this.db.request('read', this.namespace, id, this.retrieves.read);
  }

  submit(item: T): Observable<any> {
    item = this.preSubmit(item);
    if ((<any>item)._id !== '') {
      return this.db.request('update', this.namespace, [(<any>item)._id, item], this.retrieves.read);
    } else {
      delete (<any>item)._id;
      return this.db.request('create', this.namespace, item, this.retrieves.read);
    }
  }

  delete(id: string | string[]): Observable<any> {
    if (!id) return Observable.throw(new Error('id can not be empty'));
    return this.db.request('delete', this.namespace, id, this.retrieves.delete);
  }

  protected preSubmit(item: T) {
    return item;
  }
}

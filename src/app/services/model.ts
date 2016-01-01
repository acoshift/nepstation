import { DbService } from './db';
import { Observable } from 'rxjs';

export abstract class ModelService<T> {
  constructor(
    protected db: DbService,
    protected namespace: string,
    protected retrieves: any) {}

  list(): Observable<T[]> {
    return this.db.request('query', this.namespace, null, this.retrieves.refresh);
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
      this.db.request('create', this.namespace, item, this.retrieves.read);
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

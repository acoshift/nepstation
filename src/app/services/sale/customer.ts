import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from '../db';
import { ModelService, Customer } from '../../models';

@Injectable()
export class CustomersService implements ModelService<Customer> {
  private _emitter: Subject<Customer[]> = new BehaviorSubject(null);
  private _observable: Observable<Customer[]> = this._emitter.share();

  private _ns = 'sale.customers';

  constructor(private db: DbService) { }

  refresh() {
    this.db.request('query', this._ns, null, {
      _id: 1
    })
    .subscribe(
      r => {
        if (r.error) return this._emitter.error(r.error);
        this._emitter.next(r);
      },
      e => { ; }//this.log.error(e)
    );
  }

  list() {
    return this._observable;
  }

  read(id: string): Observable<Customer> {
    return this.db.request('query', this._ns, id, {
      _id: 1, name: 1, enabled: 1, role: 1
    });
  }
}

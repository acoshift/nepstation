import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from './db';
import { ModelService as _ModelService } from '../models';

export class ModelService<T> implements _ModelService<T> {
  private _emitter: Subject<T[]> = new BehaviorSubject(null);
  private _observable: Observable<T[]> = this._emitter.share();

  constructor(protected db: DbService,
              protected namespace: string,
              protected retrieves: any) { }

  refresh() {
    this.db.request('query', this.namespace, null, this.retrieves.refresh)
    .subscribe(
      r => {
        if (r.error) return this._emitter.error(r.error);
        this._emitter.next(r);
      }
    );
  }

  list() {
    return this._observable;
  }

  read(id: string): Observable<T> {
    return this.db.request('query', this.namespace, id, this.retrieves.read);
  }

  preSubmit(item: T) {
    return item;
  }

  submit(item: T) {
    item = this.preSubmit(item);
    console.log(item);
    if ((<any>item)._id !== '') {
      return this.db.request('update', this.namespace, [(<any>item)._id, item], this.retrieves.read);
    } else {
      delete (<any>item)._id;
      return this.db.request('create', this.namespace, item, this.retrieves.read);
    }
  }
}

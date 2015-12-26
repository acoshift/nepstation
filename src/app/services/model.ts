import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from './db';
import { Event } from '../models';
import { Service } from './service';
import { ModelService as _ModelService } from '../models';

export class ModelService<T> extends Service {
  /*private _emitter: Subject<T[]> = new BehaviorSubject(null);
  private _observable: Observable<T[]> = this._emitter.share();*/

  constructor(
    protected db: DbService,
    protected namespace: string,
    protected retrieves: any) { super(); }

  onEvent(event: Event) {
    switch (event.name) {
      case 'refresh':
        this._refresh();
        break;
    }
  }

  private _refresh() {
    this.db.request('query', this.namespace, null, this.retrieves.refresh)
    .subscribe(
      r => {
        if (r.error) return this.emitter.error(r.error);
        this.emitter.next({ name: 'list', data: r });
      }
    );
  }

  read(id: string): Observable<T> {
    return this.db.request('query', this.namespace, id, this.retrieves.read);
  }

  preSubmit(item: T) {
    return item;
  }

  submit(item: T) {
    item = this.preSubmit(item);
    if ((<any>item)._id !== '') {
      return this.db.request('update', this.namespace, [(<any>item)._id, item], this.retrieves.read);
    } else {
      delete (<any>item)._id;
      return this.db.request('create', this.namespace, item, this.retrieves.read);
    }
  }

  delete(id: string) {
    if (!id) return Observable.create(subscriber => {
      subscriber.error(new Error());
    });
    return this.db.request('delete', this.namespace, id, this.retrieves.delete);
  }
}

import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from './db';
import { Event } from '../models';
import { Service } from './service';

export class ReadOnlyModelService<T> extends Service {
  //private _emitter: Subject<T[]> = new BehaviorSubject(null);
  //private _observable: Observable<T[]> = this._emitter.share();

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
    this.db.request('query', this.namespace, null, this.retrieves.refresh, true)
    .subscribe(
      r => {
        if (r.error) return this.emitter.error(r.error);
        this.emitter.next({ name: 'list', data: r });
      }
    );
  }
/*
  list() {
    return this._observable;
  }

  read(id: string): Observable<T> {
    return this.db.request('query', this.namespace, id, this.retrieves.read);
  }*/
}

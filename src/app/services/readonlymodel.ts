import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from './db';
import { Event, EventHandler } from '../models';

export class ReadOnlyModelService<T> extends EventHandler {
  constructor(
    protected db: DbService,
    protected namespace: string,
    protected retrieves: any) {
    super();
  }

  onEvent(event: Event) {
    switch (event.name) {
      case 'refresh':
        this._refresh();
        break;
      case 'read':
        this._read(event.data);
        break;
    }
  }

  private _refresh() {
    this.db.request('query', this.namespace, null, this.retrieves.refresh, true)
    .subscribe(
      r => {
        if (r.error) {
          this.emitter.error(r.error);
        } else {
          this.emitter.next({ name: 'list', data: r });
        }
      },
      e => this.emitter.error(e)
    );
  }

  private _read(id: string) {
    this.db.request('query', this.namespace, id, this.retrieves.read)
      .subscribe(
        r => this.emitter.next({ name: 'read', data: r}),
        e => this.emitter.error(e)
      );
  }
}

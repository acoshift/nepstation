import { Injectable } from 'angular2/core';
import { DbService } from '../db';
import { ReadOnlyModelService } from '../readonlymodel';
import { Trash, Event } from '../../models';

@Injectable()
export class TrashService extends ReadOnlyModelService<Trash> {
  constructor(db: DbService) {
    super(db, 'db.trash', {
      refresh: { _id: 1, db: 1 },
      read: null,
      restore: null
    });
  }

  onEvent(event: Event) {
    super.onEvent(event);
    switch (event.name) {
      case 'restore':
        this._restore(event.data);
        break;
    }
  }

  protected _refresh() {
    this.db.request('query', this.namespace, null, this.retrieves.refresh)
    .subscribe(
      r => {
        if (r.error) {
          this.emitter.next({ name: 'error', data: r.error });
        } else {
          this.emitter.next({ name: 'list', data: r });
        }
      },
      e => this.emitter.next({ name: 'error', data: e })
    );
  }

  protected _restore(id: string) {
    this.db.request('restore', '', id, this.retrieves.restore)
      .subscribe(
        r => {
          if (r.error) {
            this.emitter.next({ name: 'error', data: r.error });
          } else {
            this.emitter.next({ name: 'restore', data: r });
          }
        },
        e => this.emitter.next({ name: 'error', data: e })
      );
  }
}

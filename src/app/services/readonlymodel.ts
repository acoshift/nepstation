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
          this.emitter.next({ name: 'error', data: r.error });
        } else {
          this.emitter.next({ name: 'list', data: r });
        }
      },
      e => this.emitter.next({ name: 'error', data: e })
    );
  }

  private _read(id: string) {
    this.db.request('read', this.namespace, id, this.retrieves.read)
      .subscribe(
        r => {
          if (r.error) {
            this.emitter.next({ name: 'error', data: r.error });
          } else {
            this.emitter.next({ name: 'read', data: r });
          }
        },
        e => this.emitter.next({ name: 'error', data: e })
      );
  }
}

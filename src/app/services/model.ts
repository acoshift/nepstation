import { DbService } from './db';
import { Event, EventHandler } from '../models';

export abstract class ModelService<T> extends EventHandler {
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
      case 'delete':
        this._delete(event.data);
        break;
      case 'submit':
        this._submit(event.data);
        break;
    }
  }

  protected preSubmit(item: T) {
    return item;
  }

  private _refresh() {
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

  private _read(id: string): void {
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

  private _submit(item: T): void {
    item = this.preSubmit(item);
    if ((<any>item)._id !== '') {
      this.db.request('update', this.namespace, [(<any>item)._id, item], this.retrieves.read)
        .subscribe(
          r => {
            if (r.error) {
              this.emitter.next({ name: 'error', data: r.error });
            } else {
              this.emitter.next({ name: 'submit', data: r });
            }
          },
          e => this.emitter.next({ name: 'error', data: e })
        );
    } else {
      delete (<any>item)._id;
      this.db.request('create', this.namespace, item, this.retrieves.read)
        .subscribe(
          r => {
            if (r.error) {
              this.emitter.next({ name: 'error', data: r.error });
            } else {
              this.emitter.next({ name: 'submit', data: r });
            }
          },
          e => this.emitter.next({ name: 'error', data: e })
        );
    }
  }

  private _delete(id: string): void {
    if (!id) this.emitter.error(new Error());
    this.db.request('delete', this.namespace, id, this.retrieves.delete)
      .subscribe(
        r => {
          if (r.error) {
            this.emitter.next({ name: 'error', data: r.error });
          } else {
            this.emitter.next({ name: 'delete', data: r });
          }
        },
        e => this.emitter.next({ name: 'error', data: e })
      );
  }
}

import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService, ModelService } from '../../../services';
import { Role } from '../models/role';

@Injectable()
export class RolesService extends ModelService<Role> {
  constructor(db: DbService) {
    super(db, 'db.roles', {
      refresh: {
        _id: 1, name: 1
      },
      read: {
        _id: 1, name: 1, dbs: 1
      }
    });
  }

  refresh(): Observable<Role[]> {
    let t = this.db.request('query', this.namespace, null, this.retrieves.refresh)
      .do((xs: Role[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'db.users', { $id: { role: v._id } }, null)
            .subscribe(result => v._userCount = result);
        });
      });
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }
}

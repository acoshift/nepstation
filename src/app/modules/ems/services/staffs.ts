import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService, ModelService } from '../../../services';
import { Staff } from '../models/staff';

@Injectable()
export class StaffsService extends ModelService<Staff> {
  constructor(db: DbService) {
    super(db, 'db.users', {
      refresh: {
        _id: 1, enabled: 1,
        code: 1, fullname: 1, quota: 1
      },
      read: {
        _id: 1, name: 1, enabled: 1,
        code: 1, fullname: 1, phone: 1, email: 1, quota: 1
      }
    });
  }

  refresh(): Observable<Staff[]> {
    let t = this.db.request('query', this.namespace, { role: 'ems_staff' }, this.retrieves.refresh)
      .do((xs: Staff[]) => {
        _.forEach(xs, v => {
          this.db.request('count', 'ems.tasks', { $id: { staff: v._id } }, null)
            .subscribe(result => v._taskCount = result);
        });
      });
    t.subscribe(
      result => this._list.next(result),
      error => { /* skip error here */ }
    );
    return t;
  }

  preSubmit(item: Staff) {
    if (item.pwd === '') {
      delete item.pwd;
    } else {
      item['$bcrypt'] = {
        pwd: item.pwd
      };
      delete item.pwd;
    }

    item.role = 'ems_staff';

    return item;
  }
}

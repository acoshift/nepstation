import { Injectable } from 'angular2/core';
import { DbService, ModelService } from '../../../services';
import { User } from '../models/user';

@Injectable()
export class UsersService extends ModelService<User> {
  constructor(db: DbService) {
    super(db, 'db.users', {
      refresh: {
        _id: 1, name: 1, enabled: 1, role: 1
      },
      read: {
        _id: 1, name: 1, enabled: 1, role: 1
      }
    });
  }

  preSubmit(item: User) {
    if (item.pwd === '') {
      delete item.pwd;
    } else {
      item['$bcrypt'] = {
        pwd: item.pwd
      };
      delete item.pwd;
    }

    if (!!item.role) {
      item.$id = { role: item.role };
      delete item.role;
    }

    return item;
  }
}

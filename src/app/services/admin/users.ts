import { Injectable } from 'angular2/core';
import { DbService } from '../db';
import { ModelService } from '../model';
import { User } from '../../models';

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
}

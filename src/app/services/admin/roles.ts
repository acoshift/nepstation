import { Injectable } from 'angular2/core';
import { DbService } from '../db';
import { ModelService } from '../model';
import { Role } from '../../models';

@Injectable()
export class RolesService extends ModelService<Role> {
  constructor(db: DbService) {
    super(db, 'db.roles', {
      refresh: {
        _id: 1, name: 1, dbs: 1
      },
      read: {
        _id: 1, name: 1, dbs: 1
      }
    });
  }
}

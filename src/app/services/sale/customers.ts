import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from '../db';
import { ModelService } from '../model';
import { User } from '../../models';

@Injectable()
export class CustomersService extends ModelService<User> {
  constructor(db: DbService) {
    super(db, 'sale.customers', {
      refresh: {
        _id: 1
      },
      read: {
        _id: 1
      }
    });
  }
}

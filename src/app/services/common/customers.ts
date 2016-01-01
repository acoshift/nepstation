import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from '../db';
import { ModelService } from '../model';
import { Customer } from '../../models';

@Injectable()
export class CustomersService extends ModelService<Customer> {
  constructor(db: DbService) {
    super(db, 'common.customers', {
      refresh: {
        _id: 1, name: 1
      },
      read: {
        _id: 1, name: 1, gender: 1
      }
    });
  }
}

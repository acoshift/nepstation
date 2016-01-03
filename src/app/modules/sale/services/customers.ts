import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService, ModelService } from '../../../services';
import { Customer } from '../models/customer';

@Injectable()
export class CustomersService extends ModelService<Customer> {
  constructor(db: DbService) {
    super(db, 'sale.customers', {
      refresh: {
        _id: 1, name: 1, type: 1, phone: 1
      },
      read: {
        _id: 1, name: 1, gender: 1, type: 1, phone: 1
      }
    });
  }

  preSubmit(item: Customer) {
    if (!!item.type) {
      item.$id = { type: item.type };
      delete item.type;
    }

    return item;
  }
}

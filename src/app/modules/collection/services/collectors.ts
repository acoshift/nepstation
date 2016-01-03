import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs';
import { DbService, ModelService } from '../../../services';
import { Collector } from '../models/collector';

@Injectable()
export class CollectorsService extends ModelService<Collector> {
  constructor(db: DbService) {
    super(db, 'collection.collectors', {
      refresh: {
        _id: 1, code: 1, name: 1, phone: 1, email: 1, quota: 1
      },
      read: {
        _id: 1, code: 1, name: 1, phone: 1, email: 1, quota: 1
      }
    });
  }

  preSubmit(item: Collector) {
    /*
    if (!!item.type) {
      item.$id = { type: item.type };
      delete item.type;
    }
    */

    return item;
  }
}

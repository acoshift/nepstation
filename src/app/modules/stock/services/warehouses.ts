import { Injectable } from 'angular2/core';
import { DbService, ModelService } from '../../../services';
import { Warehouse } from '../models/warehouse';

@Injectable()
export class WarehousesService extends ModelService<Warehouse> {
  constructor(db: DbService) {
    super(db, 'stock.warehouses', {
      refresh: {
        _id: 1, name: 1, contact: { district: 1, province: 1, country: 1, phone: 1 }
      },
      read: null
    });
  }
}

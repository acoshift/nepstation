import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Directives } from '../../../directives';
import { WarehousesService } from '../services/warehouses';
import { Warehouse } from '../models/warehouse';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./warehouse.dialog.jade'),
  directives: [ Directives ]
})
class WarehouseDialog extends ModelDialog<Warehouse> {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    remark: [''],
    taxId: [''],
    contact: {
      address: [''],
      subdistrict: [''],
      district: [''],
      province: [''],
      postalCode: [''],
      country: [''],
      phone: [''],
      fax: [''],
      email: [''],
      website: ['']
    }
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: WarehousesService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group({
      _id: [''],
      name: ['', Validators.required],
      remark: [''],
      taxId: [''],
      contact: fb.group({
        address: [''],
        subdistrict: [''],
        district: [''],
        province: [''],
        postalCode: [''],
        country: [''],
        phone: [''],
        fax: [''],
        email: [''],
        website: ['']
      })
    });
  }

  showAdd() {
    this.show({
      header: 'Add Warehouse',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: Warehouse, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Warehouse: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            remark: [result.remark],
            taxId: [result.taxId],
            contact: {
              address: [result.contact.address],
              subdistrict: [result.contact.subdistrict],
              district: [result.contact.district],
              province: [result.contact.province],
              postalCode: [result.contact.postalCode],
              country: [result.contact.country],
              phone: [result.contact.phone],
              fax: [result.contact.fax],
              email: [result.contact.email],
              website: [result.contact.website]
            }
          }
        });
      },
      error => { /* TODO: Error handler */ },
      () => {
        if (e) e.loading = false;
      }
    );
  }
}

@Component({})
@View({
  template: require('./warehouses.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    WarehouseDialog,
    Directives,
  ]
})
export class WarehousesRoute extends TableComponent<Warehouse> {
  @ViewChild(WarehouseDialog)
  protected dialog: WarehouseDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(navbar: NavbarService,
              service: WarehousesService) {
    super(service);
    navbar.active('stock/warehouses');
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'district': x => !!x.contact && !!x.contact.district && x.contact.district.toLowerCase().includes(k),
      'province': x => !!x.contact && !!x.contact.province && x.contact.province.toLowerCase().includes(k),
      'country': x => !!x.contact && !!x.contact.country && x.contact.country.toLowerCase().includes(k),
      'phone': x => !!x.contact && !!x.contact.phone && x.contact.phone.toLowerCase().includes(k),
    };
  }
}

import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService, CustomersService, CustomerTypesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Customer, CustomerType } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./customer.dialog.jade'),
  directives: [ Directives ]
})
class CustomerDialog extends ModelDialog<Customer> {
  types: CustomerType[];

  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    gender: ['', Validators.required],
    type: ['', Validators.required],
    phone: ['']
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: CustomersService,
    types: CustomerTypesService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    types.list.subscribe(
      result => {
        this.types = result;
      }
    );

    types.refresh();
  }

  showAdd() {
    this.show({
      header: 'Add Customer',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: Customer, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Customer: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            gender: [result.gender, Validators.required],
            type: [result.type, Validators.required],
            phone: [result.phone]
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
  template: require('./customers.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    CustomerDialog,
    Directives,
  ]
})
export class CustomersRoute extends TableComponent<Customer> {
  @ViewChild(CustomerDialog)
  dialog: CustomerDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  types: CustomerType[];

  constructor(navbar: NavbarService,
              service: CustomersService,
              types: CustomerTypesService) {
    super(service);
    navbar.active('common/customers');

    types.list.subscribe(
      result => {
        this.types = result;
      }
    );

    types.refresh();
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'type': x => !!x.type && this.getType(x.type).toLowerCase().includes(k),
      'phone': x => !!x.phone && x.phone.replace(/\-/, '').toLowerCase().includes(k.replace(/\-/, ''))
    };
  };

  getType(type: string): string {
    let t = _.find(this.types, x => x._id === type || x.name === type);
    return t && t.name || type;
  }
}

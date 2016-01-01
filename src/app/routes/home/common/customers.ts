import { Component, View, ElementRef, ViewChild } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { NavbarService, CustomersService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import { Log } from '../../../models';
import _ = require('lodash');
import { Customer } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./customer.dialog.jade'),
  directives: [ Directives ]
})
class CustomerDialog extends ModelDialog<Customer> {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    gender: ['', Validators.required]
  };

  constructor(
    e: ElementRef,
    service: CustomersService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);
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
            gender: [result.gender, Validators.required]
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

  constructor(navbar: NavbarService,
              service: CustomersService) {
    super(service);
    navbar.active('common/customers');
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      /*switch (this.search.field) {
        case '':
          return x.t.payload.sub.split('/')[0].indexOf(this.search.keyword) !== -1 ||
            x.q.method.indexOf(this.search.keyword) !== -1 ||
            x.q.name.indexOf(this.search.keyword) !== -1;
        case 'user':
          return x.t.payload.sub.split('/')[0].indexOf(this.search.keyword) !== -1;
        case 'method':
          return x.q.method.indexOf(this.search.keyword) !== -1;
        case 'collection':
          return x.q.name.indexOf(this.search.keyword) !== -1;
      }*/
      return false;
    };
  }
}

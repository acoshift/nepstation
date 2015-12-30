import { Component, View, ElementRef } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { NavbarService, CustomersService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import { Log } from '../../../models';
import _ = require('lodash');
import { Customer, Event } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: '.dialog',
  host: {
    class: 'ui long modal'
  }
})
@View({
  template: require('./customer.dialog.jade'),
  directives: [ Directives ]
})
class CustomerDialog extends ModelDialog {
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

  onEvent(event: Event) {
    super.onEvent(event);
    switch (event.name) {
      case 'add':
        this.next.emit({ name: 'dropdown', data: ['clear'] });
        super.onEvent({
          name: 'modelDialog',
          data: {
            header: 'Add Customer',
            button: 'Add',
            model: this._modelTemplate
          }
        });
        break;
      case 'edit':
        this.next.emit({ name: 'dropdown', data: ['set selected', event.data.gender] });
        super.onEvent({
          name: 'modelDialog',
          data: {
            header: 'Edit Customer: ' + event.data.name,
            button: 'Update',
            model: {
              _id: [event.data._id],
              name: [event.data.name, Validators.required],
              gender: [event.data.gender, Validators.required]
            }
          }
        });
        break;
    }
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
export class CustomersRoute extends TableComponent {
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

import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService, CustomerTypesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { CustomerType } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./customer_type.dialog.jade'),
  directives: [ Directives ]
})
class CustomerTypeDialog extends ModelDialog<CustomerType> {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    remark: ['']
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: CustomerTypesService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);
  }

  showAdd() {
    this.show({
      header: 'Add Customer Type',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: CustomerType, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Customer Type: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            remark: [result.remark]
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
  template: require('./customer_types.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    CustomerTypeDialog,
    Directives,
  ]
})
export class CustomerTypesRoute extends TableComponent<CustomerType> {
  @ViewChild(CustomerTypeDialog)
  protected dialog: CustomerTypeDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(navbar: NavbarService,
              service: CustomerTypesService) {
    super(service);
    navbar.active('common/customer_types');
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k)
    };
  }
}

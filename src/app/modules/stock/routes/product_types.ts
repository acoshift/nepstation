import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Directives } from '../../../directives';
import { ProductTypesService } from '../services/product_types';
import { ProductType } from '../models/product_type';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./product_type.dialog.jade'),
  directives: [ Directives ]
})
class ProductTypeDialog extends ModelDialog<ProductType> {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    remark: ['']
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: ProductTypesService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);
  }

  showAdd() {
    this.show({
      header: 'Add Product Type',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: ProductType, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Product Type: ' + result.name,
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
  template: require('./product_types.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    ProductTypeDialog,
    Directives,
  ]
})
export class ProductTypesRoute extends TableComponent<ProductType> {
  @ViewChild(ProductTypeDialog)
  protected dialog: ProductTypeDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(navbar: NavbarService,
              service: ProductTypesService) {
    super(service);
    navbar.active('stock/product_types');
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k)
    };
  }
}

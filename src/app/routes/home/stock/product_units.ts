import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { NavbarService, ProductUnitsService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import { Log } from '../../../models';
import _ = require('lodash');
import { ProductUnit } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./product_unit.dialog.jade'),
  directives: [ Directives ]
})
class ProductUnitDialog extends ModelDialog<ProductUnit> {
  list: ProductUnit[];

  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    remark: [''],
    base: [''],
    baseAmount: []
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: ProductUnitsService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    service.list.subscribe(
      result => {
        this.list = result;
      }
    );

    service.refresh();
  }

  showAdd() {
    this.show({
      header: 'Add Product Unit',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: ProductUnit, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Product Unit: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            remark: [result.remark],
            base: [result.base],
            baseAmount: [result.baseAmount]
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
  template: require('./product_units.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    ProductUnitDialog,
    Directives,
  ]
})
export class ProductUnitsRoute extends TableComponent<ProductUnit> {
  @ViewChild(ProductUnitDialog)
  dialog: ProductUnitDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(navbar: NavbarService,
              service: ProductUnitsService) {
    super(service);
    navbar.active('stock/product_units');
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'base': x => !!x.base && this.getBaseName(x.base).toLowerCase().includes(k),
    };
  };

  getBaseName(id: string) {
    let t = _.find(this.list, x => x._id === id);
    return t && t.name || '';
  }
}

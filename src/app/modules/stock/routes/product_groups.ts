import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Directives } from '../../../directives';
import { ProductGroupsService } from '../services/product_groups';
import { ProductTypesService } from '../services/product_types';
import { ProductGroup } from '../models/product_group';
import { ProductType } from '../models/product_type';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./product_group.dialog.jade'),
  directives: [ Directives ]
})
class ProductGroupDialog extends ModelDialog<ProductGroup> {
  types: ProductType[];

  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    type: ['', Validators.required],
    remark: ['']
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: ProductGroupsService,
    types: ProductTypesService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    types.list.subscribe(
      result => this.types = result
    );

    types.refresh();
  }

  showAdd() {
    this.show({
      header: 'Add Product Group',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: ProductGroup, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Product Group: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            type: [result.type, Validators.required],
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
  template: require('./product_groups.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    ProductGroupDialog,
    Directives,
  ]
})
export class ProductGroupsRoute extends TableComponent<ProductGroup> {
  @ViewChild(ProductGroupDialog)
  protected dialog: ProductGroupDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  types: ProductType[];

  constructor(navbar: NavbarService,
              service: ProductGroupsService,
              types: ProductTypesService) {
    super(service);
    navbar.active('stock/product_groups');

    types.list.subscribe(
      result => this.types = result
    );

    types.refresh();
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'type': x => !!x.type && this.getTypeName(x.type).toLowerCase().includes(k)
    };
  }

  getTypeName(id: string) {
    let t = _.find(this.types, x => x._id === id);
    return t && t.name || '';
  }
}

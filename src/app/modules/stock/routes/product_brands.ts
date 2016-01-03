import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Directives } from '../../../directives';
import { ProductBrandsService } from '../services/product_brands';
import { ProductBrand } from '../models/product_brand';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./product_brand.dialog.jade'),
  directives: [ Directives ]
})
class ProductBrandDialog extends ModelDialog<ProductBrand> {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    remark: ['']
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: ProductBrandsService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);
  }

  showAdd() {
    this.show({
      header: 'Add Product Brand',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: ProductBrand, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Product Brand: ' + result.name,
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
  template: require('./product_brands.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    ProductBrandDialog,
    Directives,
  ]
})
export class ProductBrandsRoute extends TableComponent<ProductBrand> {
  @ViewChild(ProductBrandDialog)
  protected dialog: ProductBrandDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(navbar: NavbarService,
              service: ProductBrandsService) {
    super(service);
    navbar.active('stock/product_brands');
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k)
    };
  }
}

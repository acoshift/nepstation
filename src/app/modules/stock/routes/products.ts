import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Directives } from '../../../directives';
import { ProductsService } from '../services/products';
import { ProductGroupsService } from '../services/product_groups';
import { ProductTypesService } from '../services/product_types';
import { ProductBrandsService } from '../services/product_brands';
import { Product } from '../models/product';
import { ProductGroup } from '../models/product_group';
import { ProductType } from '../models/product_type';
import { ProductBrand } from '../models/product_brand';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./product.dialog.jade'),
  directives: [ Directives ]
})
class ProductDialog extends ModelDialog<Product> {
  types: ProductType[];
  groups: ProductGroup[];
  brands: ProductBrand[];

  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    group: ['', Validators.required],
    brand: ['', Validators.required],
    price: ['', Validators.required],
    point: ['', Validators.required],
    remark: ['']
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: ProductsService,
    types: ProductTypesService,
    groups: ProductGroupsService,
    brands: ProductBrandsService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    types.list.subscribe(
      result => this.types = result
    );
    groups.list.subscribe(
      result => this.groups = result
    );
    brands.list.subscribe(
      result => this.brands = result
    );

    types.refresh();
    groups.refresh();
    brands.refresh();
  }

  showAdd() {
    this.show({
      header: 'Add Product',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: Product, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Product: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            group: [result.group, Validators.required],
            brand: [result.brand, Validators.required],
            price: [result.price, Validators.required],
            point: [result.point, Validators.required],
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
  template: require('./products.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    ProductDialog,
    Directives,
  ]
})
export class ProductsRoute extends TableComponent<Product> {
  @ViewChild(ProductDialog)
  protected dialog: ProductDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  types: ProductType[];
  groups: ProductGroup[];
  brands: ProductBrand[];

  constructor(navbar: NavbarService,
              service: ProductsService,
              types: ProductTypesService,
              groups: ProductGroupsService,
              brands: ProductBrandsService) {
    super(service);
    navbar.active('stock/products');

    types.list.subscribe(
      result => this.types = result
    );
    groups.list.subscribe(
      result => this.groups = result
    );
    brands.list.subscribe(
      result => this.brands = result
    );

    types.refresh();
    groups.refresh();
    brands.refresh();
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'type': x => !!x.group && this.getTypeName(x).toLowerCase().includes(k),
      'group': x => !!x.group && this.getGroupName(x.group).toLowerCase().includes(k),
      'brand': x => !!x.brand && this.getBrandName(x.brand).toLowerCase().includes(k),
    };
  }

  getTypeName(item: Product) {
    let t: any = _.find(this.groups, x => x._id === item.group);
    if (!t) return '';
    t = _.find(this.types, x => x._id === t.type);
    return t && t.name || '';
  }

  // TODO: Refactor this code
  getGroupName(id: string) {
    let t = _.find(this.groups, x => x._id === id);
    return t && t.name || '';
  }

  getBrandName(id: string) {
    let t = _.find(this.brands, x => x._id === id);
    return t && t.name || '';
  }
}

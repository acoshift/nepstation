import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService, CollectorsService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { Collector } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./collector.dialog.jade'),
  directives: [ Directives ]
})
class CollectorDialog extends ModelDialog<Collector> {
  private _modelTemplate = {
    _id: [''],
    code: [''],
    name: ['', Validators.required],
    phone: [''],
    email: [''],
    quota: [0]
  };

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: CollectorsService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);
  }

  showAdd() {
    this.show({
      header: 'Add Collector',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: Collector, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Collector: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            code: [result.code],
            name: [result.name, Validators.required],
            phone: [result.phone],
            email: [result.email],
            quota: [result.quota]
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
  template: require('./collectors.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    CollectorDialog,
    Directives,
  ]
})
export class CollectorsRoute extends TableComponent<Collector> {
  @ViewChild(CollectorDialog)
  dialog: CollectorDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(navbar: NavbarService,
              service: CollectorsService) {
    super(service);
    navbar.active('collection/collectors');
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'code': x => !!x.code && x.code.toLowerCase().includes(k),
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'phone': x => !!x.phone && x.phone.replace(/\-/, '').toLowerCase().includes(k.replace(/\-/, '')),
      'email': x => !!x.email && x.email.toLowerCase().includes(k)
    };
  };
}

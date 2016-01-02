import { Component, View, ViewChild } from 'angular2/core';
import { NavbarService, TrashService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import { TimestampPipe, MomentPipe } from '../../../pipes';
import _ = require('lodash');
import { Trash } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({})
@View({
  template: require('./trash.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    Directives,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
  ]
})
export class TrashRoute extends TableComponent<Trash> {
  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(
    navbar: NavbarService,
    protected service: TrashService) {
    super(service);
    navbar.active('admin/trash');
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x._id.indexOf(this.search.keyword) !== -1 ||
                 x.db.indexOf(this.search.keyword) !== -1;
        case 'id':
          return x._id.indexOf(this.search.keyword) !== -1;
        case 'db':
          return x.db.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }

  restore(item: Trash) {
    this.service.restore(item._id);
  }

  restoreSelected() {
    let ids = _(this.selected).map(x => x._id).value();
    if (!ids.length) {
      this.alert.show({
        title: '',
        content: 'Please select items first.',
        buttons: [ 'ok' ]
      });
      return;
    }
    this.alert.show({
      title: '',
      content: `Are you sure you want to restore ${ids.length} selected items?`,
      buttons: [ 'restore', 'cancel.primary' ],
      wait: true,
      onApprove: () => {
        this.service.restore(ids).subscribe(null, error => this.error(error), () => {
          this.resetSelected();
          this.service.refresh().subscribe(null, null, () => this.alert.hide());
        });
      }
    });
  }

  view(item: Trash, e?): void {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => this.alert.show({
        title: `Restore "${result._id}"?`,
        code: JSON.stringify(result, null, 4),
        buttons: [ 'restore', 'cancel.primary' ],
        wait: true,
        onApprove: () => {
          this.service.restore(result._id).subscribe(null, error => this.error(error), () => {
            this.service.refresh().subscribe(null, null, () => this.alert.hide());
          });
        }
      }),
      error => this.error(error),
      () => {
        if (e) e.loading = false;
      }
    );
  }
}

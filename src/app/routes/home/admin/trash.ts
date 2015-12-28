import { Component, View } from 'angular2/core';
import { NavbarService, TrashService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import { TimestampPipe, MomentPipe } from '../../../pipes';
import _ = require('lodash');
import { Trash, Event } from '../../../models';
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
export class TrashRoute extends TableComponent {
  constructor(
    navbar: NavbarService,
    service: TrashService) {
    super(service);
    navbar.active('admin/trash');
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x._id.indexOf(this.search.keyword) !== -1 ||
                 x.db.indexOf(this.search.keyword) !== -1 ||
                 JSON.stringify(x.data).indexOf(this.search.keyword) !== -1;
        case 'id':
          return x._id.indexOf(this.search.keyword) !== -1;
        case 'db':
          return x.db.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }

  restore(item: Trash) {
    this.service.next({
      name: 'restore',
      data: item._id
    });
  }

  restoreSelected() {
    let ids = _(this.selected).map(x => x._id).value();
    if (!ids.length) {
      this.emitter.next({
        name: 'alert',
        data: {
          title: '',
          content: 'Please select items first.',
          buttons: [ 'ok' ]
        }
      });
      return;
    }
    this.emitter.next({
      name: 'alert',
      data: {
        title: '',
        content: `Are you sure you want to restore ${ids.length} selected items?`,
        buttons: [ 'restore', 'cancel.primary' ],
        wait: true,
        onApprove: () => {
          this.service.next({
            name: 'restore',
            data: ids
          });
          this.resetSelected();
        }
      }
    });
  }

  onEvent(event: Event) {
    super.onEvent(event);
    switch (event.name) {
      case 'read':
        let item: Trash = event.data;
        this.emitter.next({
          name: 'alert',
          data: {
            title: `Restore "${item._id}"?`,
            code: JSON.stringify(item, null, 4),
            buttons: [ 'restore', 'cancel.primary' ],
            wait: true,
            onApprove: () => this.restore(item)
          }
        });
        break;
      case 'restore':
        this.service.next({ name: 'refresh' });
        break;
    }
  }

  view(item: Trash) {
    this.service.next({ name: 'read', data: item._id });
  }
}

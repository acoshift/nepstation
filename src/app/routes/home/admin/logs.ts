import { Component, View, ViewChild } from 'angular2/core';
import { NavbarService, LogsService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import { TimestampPipe, MomentPipe } from '../../../pipes';
import { Directives } from '../../../directives';
import { Event, Log } from '../../../models';

@Component({})
@View({
  template: require('./logs.jade'),
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
export class LogsRoute extends TableComponent {
  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(
    navbar: NavbarService,
    service: LogsService) {
    super(service);
    navbar.active('admin/logs');
    this.page.itemPerPage = 23;
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x.t.payload.name.indexOf(this.search.keyword) !== -1 ||
                 x.q.method.indexOf(this.search.keyword) !== -1 ||
                 x.q.name.indexOf(this.search.keyword) !== -1;
        case 'user':
          return x.t.payload.name.indexOf(this.search.keyword) !== -1;
        case 'method':
          return x.q.method.indexOf(this.search.keyword) !== -1;
        case 'collection':
          return x.q.name.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }

  onEvent(event: Event) {
    super.onEvent(event);
    switch (event.name) {
      case 'read':
        let item: Log = event.data;
        this.alert.show({
          title: `Log: "${item._id}"`,
          code: JSON.stringify(item, null, 4),
          buttons: [ 'ok' ]
        });
        break;
    }
  }

  view(item: Log) {
    this.service.next({ name: 'read', data: item._id });
  }
}

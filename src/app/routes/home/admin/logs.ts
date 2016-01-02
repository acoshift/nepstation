import { Component, View, ViewChild } from 'angular2/core';
import { NavbarService, LogsService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import { TimestampPipe, MomentPipe } from '../../../pipes';
import { Directives } from '../../../directives';
import { Log } from '../../../models';

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
export class LogsRoute extends TableComponent<Log> {
  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  @ViewChild(PaginationComponent)
  protected pagination: PaginationComponent;

  constructor(
    navbar: NavbarService,
    service: LogsService) {
    super(service);
    navbar.active('admin/logs');
    this.page.itemPerPage = 23;
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'user': x => !!x.t && !!x.t.payload && x.t.payload.name && x.t.payload.name.toLowerCase().includes(k),
      'method': x => !!x.q && !!x.q.method && x.q.method.toLowerCase().includes(k),
      'collection': x => !!x.q && x.q.name && x.q.name.toLowerCase().includes(k)
    };
  };
}

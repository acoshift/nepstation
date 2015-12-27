import { Component, View } from 'angular2/core';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, CustomersService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import { Log } from '../../../models';
import _ = require('lodash');
import moment = require('moment');
import { Directives } from '../../../directives';
declare var $: any;

@Component({})
@View({
  template: require('./customers.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    Directives,
  ]
})
export class CustomersRoute extends TableComponent {
  constructor(navbar: NavbarService,
              service: CustomersService) {
    super(service);
    navbar.active('sale/customers');
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      /*switch (this.search.field) {
        case '':
          return x.t.payload.sub.split('/')[0].indexOf(this.search.keyword) !== -1 ||
            x.q.method.indexOf(this.search.keyword) !== -1 ||
            x.q.name.indexOf(this.search.keyword) !== -1;
        case 'user':
          return x.t.payload.sub.split('/')[0].indexOf(this.search.keyword) !== -1;
        case 'method':
          return x.q.method.indexOf(this.search.keyword) !== -1;
        case 'collection':
          return x.q.name.indexOf(this.search.keyword) !== -1;
      }*/
      return false;
    };
  }
}

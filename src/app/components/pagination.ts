import { Component, OnInit } from 'angular2/core';

import _ = require('lodash');

@Component({
  selector: 'pagination',
  properties: [ 'page', 'perPage', 'count' ],
  template: require('./pagination.jade')
})
export class PaginationComponent implements OnInit {
  pages: number[];
  page: number;
  perPage: number;
  count: number;
  pageCount: number;

  ngOnInit() {
    this.pageCount = Math.abs(this.count / this.perPage);
    this.pages = _.range(0, this.pageCount);
  }

  goto(page) {
    this.page = page;
  }

  next() {
    if (this.page < this.pageCount - 1) ++this.page;
  }

  prev() {
    if (this.page > 0) --this.page;
  }
}

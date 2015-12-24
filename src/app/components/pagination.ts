import { Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';

import _ = require('lodash');

@Component({
  selector: 'pagination',
  template: require('./pagination.jade')
})
export class PaginationComponent implements OnInit {
  pages: number[];

  @Input()
  page: number;

  @Input()
  perPage: number;

  @Input()
  count: number;

  pageCount: number;

  @Output()
  pageChange = new EventEmitter();

  ngOnInit() {
    this.pageCount = Math.abs(this.count / this.perPage);
    this.pages = _.range(0, this.pageCount);
  }

  goto(page) {
    this.page = page;
    this.pageChange.emit(page);
  }

  next() {
    if (this.page < this.pageCount - 1)
      this.goto(this.page + 1);
  }

  prev() {
    if (this.page > 0)
      this.goto(this.page - 1);
  }
}

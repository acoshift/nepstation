import { Component, OnInit, Input, Output, EventEmitter } from 'angular2/core';
import { Observable } from 'rxjs';
import { Page } from '../models';
import _ = require('lodash');

@Component({
  selector: 'pagination',
  template: require('./pagination.jade')
})
export class PaginationComponent implements OnInit {
  pages: number[];

  @Input()
  page: Page;

  @Input()
  refresh: Observable<void>;

  @Output()
  pageChange = new EventEmitter();

  ngOnInit() {
    this.pageChange.subscribe(r => {
      this.page = r;
      this._refresh();
    });
    this.refresh.subscribe(() => {
      this.page.current = 0;
      this._refresh();
    });
    this._refresh();
  }

  _refresh() {
    this.page.total = Math.abs(this.page.itemCount / this.page.itemPerPage);
    this.pages = _.range(0, this.page.total);
  }

  goto(page: number) {
    this.page.current = page;
    this.pageChange.emit(this.page);
  }

  next() {
    if (this.page.current < this.page.total - 1)
      this.goto(this.page.current + 1);
  }

  prev() {
    if (this.page.current > 0)
      this.goto(this.page.current - 1);
  }
}

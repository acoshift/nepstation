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
    let r = [];
    if (this.page.current - 2 > 0) r = [-1];
    r = r.concat(_.range(Math.max(this.page.current - 2, 0), Math.min(this.page.current + 3, this.page.total)));
    if (this.page.current + 3 < this.page.total) r = r.concat([-1]);
    this.pages = r;
  }

  goto(page: number) {
    if (page < 0) return;
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

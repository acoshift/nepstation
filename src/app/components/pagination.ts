import { Component } from 'angular2/core';
import { Page, Event } from '../models';
import { EventComponent } from './event';
import _ = require('lodash');

@Component({
  selector: 'pagination',
  template: require('./pagination.jade')
})
export class PaginationComponent extends EventComponent {
  pages: number[];
  data: Page;

  ngOnInit() {
    super.ngOnInit();
    this._refresh();
  }

  onEvent(event: Event) {
    if (event.name === 'refreshPage') {
      this.data.current = 0;
      this._refresh();
    }
  }

  private _refresh() {
    this.data.total = Math.ceil(this.data.itemCount / this.data.itemPerPage);
    let r = [];
    if (this.data.current - 2 > 0) r = [0, -1];
    r = r.concat(_.range(Math.max(this.data.current - 2, 0), Math.min(this.data.current + 3, this.data.total)));
    if (this.data.current + 3 < this.data.total) r = r.concat([-1, this.data.total - 1]);
    this.pages = r;
  }

  private _gotoPage(page: number) {
    if (page < 0) return;
    this.data.current = page;
    this.next.emit({ name: 'gotoPage' });
    this._refresh();
  }

  private _nextPage() {
    if (this.data.current < this.data.total - 1)
      this._gotoPage(this.data.current + 1);
  }

  private _prevPage() {
    if (this.data.current > 0)
      this._gotoPage(this.data.current - 1);
  }
}

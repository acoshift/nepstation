import { Component } from 'angular2/core';
import { Observable, Subscriber } from 'rxjs';
import { Page } from '../models';
import moment = require('moment');

@Component({})
export abstract class TableComponent {
  protected search = {
    keyword: '',
    field: '',
    date: {
      start: 0,
      end: 0,
    }
  };

  protected repeater: Observable<void> = Observable.create(subscriber => this._repeater = subscriber).share();

  protected page: Page = {
    current: 0,
    total: 0,
    itemCount: 0,
    itemPerPage: 20,
  };

  protected loading = true;

  protected service: any;

  private _repeater: Subscriber<void>;

  refresh() {
    this._repeater.next();
  }

  abstract filter(): (any) => boolean;

  setStartDate(date: string): void {
    this.search.date.start = this._fromDate(date);
    this.refresh();
  }

  setEndDate(date: string): void {
    this.search.date.end = this._fromDate(date);
    this.refresh();
  }

  setField(field: string): void {
    this.search.field = field;
    this.refresh();
  }

  setKeyword(keyword: string): void {
    this.search.keyword = keyword;
    this.refresh();
  }

  remove(item: any) {
    this.service.remove(item);
    this.refresh();
  }

  dateFilter(): (item) => boolean {
    return item => {
      return item._id && this._dateFilter(parseInt(item._id.substr(0, 8), 16) * 1000);
    };
  }

  private _dateFilter(ts: number): boolean {
    let r = true;
    if (this.search.date.start && this.search.date.start > ts) r = false;
    if (r && this.search.date.end && this.search.date.end < ts) r = false;
    return r;
  }

  private _fromDate(date: string): number {
    return moment(date, 'YYYY-MM-DD').utc().unix() * 1000;
  }
}

import { Component, ViewChild } from 'angular2/core';
import { Observable, Subject } from 'rxjs';
import { Page, Id } from '../models';
import { AlertComponent } from './alert';
import { ModelDialog } from './modeldialog';
import { PaginationComponent } from './pagination';
import { ModelService } from '../services/model';
import moment = require('moment');

declare var $: any;

export abstract class TableComponent<T extends Id> {
  protected search = {
    keyword: '',
    field: '',
    date: {
      start: 0,
      end: 0,
    }
  };

  protected loading: boolean;

  protected selected: any[] = [];

  protected alert: AlertComponent;

  protected dialog: ModelDialog<T>;

  protected pagination: PaginationComponent;

  protected filters: { [ key: string ]: Function };

  private _list: T[] = null;

  private _page: Page = {
    current: 0,
    total: 0,
    itemCount: 0,
    itemPerPage: 20,
  };

  private _repeatFilter = () => { /* empty */ };
  private _repeatPage = () => { /* empty */ };

  constructor(protected service: ModelService<T>) {
    this.loading = true;
    this.service.list
      .filter(xs => !!xs)
      .map(xs => _.clone(xs).reverse())
      .flatMap<T[]>(xs => Observable.create(emitter => {
        emitter.next(xs);
        this._repeatFilter = () => { emitter.next(xs); };
      }))
      .map(xs => _.filter(xs, x => this.dateFilter(x)))
      .map(xs => _.filter(xs, x => this._filter(x)))
      .do(xs => {
        this.page.itemCount = _.isArray(xs) && xs.length || 0;
        if (this.pagination) this.pagination.page = this.page;
      })
      .flatMap<T[]>(xs => Observable.create(emitter => {
        emitter.next(xs);
        this._repeatPage = () => { emitter.next(xs); };
      }))
      .map(xs => {
        let p = this.page.current * this.page.itemPerPage;
        let k = this.page.itemPerPage && p + this.page.itemPerPage || undefined;
        return _.slice(xs, p, k);
      })
      .subscribe(r => {
        this._list = r;
        if (this.loading) {
          if (_.isArray(r) && r.length > 0) this.loading = false;
        }
      });

    this.refresh();
  }

  error(item: Id) {
    this.alert.show({
      title: item.error.name,
      content: item.error.message,
      buttons: [ 'ok' ]
    });
  }

  refresh() {
    this.service.refresh();
  }

  get list(): T[] {
    return this._list;
  }

  get page() {
    return this._page;
  }

  set page(page: Page) {
    this._page = page;
    this._repeatPage();
  }

  getName(item: T) {
    return (<any>item).name;
  }

  add() {
    this.dialog.showAdd();
  }

  edit(item, e) {
    this.dialog.showEdit(item, e);
  }

  delete(item) {
    this.alert.show({
      title: '',
      content: `Are you sure you want to delete "${this.getName(item)}"?`,
      buttons: [ 'delete', 'cancel.primary' ],
      wait: true,
      onApprove: () => this.service.delete(item._id).subscribe(
        null,
        error => this.error(error),
        () => {
          this.service.refresh().subscribe(null, null, () => {
            this.alert.hide();
          });
        })
    });
  }

  view(item: T, e?): void {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => this.alert.show({
        title: `Log: "${result._id}"`,
        code: JSON.stringify(result, null, 4),
        buttons: [ 'ok' ]
      }),
      error => this.error(error),
      () => {
        if (e) e.loading = false;
      }
    );
  }

  setStartDate(date: string): void {
    this.search.date.start = this._fromDate(date);
    this._repeatFilter();
  }

  setEndDate(date: string): void {
    this.search.date.end = this._fromDate(date);
    this._repeatFilter();
  }

  setField(field: string): void {
    this.search.field = field;
    this._repeatFilter();
  }

  setKeyword(keyword: string): void {
    this.search.keyword = keyword;
    this._repeatFilter();
  }

  select(item, value: boolean) {
    if (typeof value === 'undefined') {
      return _.contains(this.selected, x => x === item);
    }
    if (value) {
      this.selected.push(item);
    } else {
      _.remove(this.selected, x => x === item);
    }
  }

  deleteSelected() {
    let ids = _(this.selected).map(x => x._id).value();
    if (!ids.length) {
      this.alert.show({
        title: '',
        content: 'Please select items first.',
        buttons: [ 'ok' ]
      });
      return;
    }
    this.alert.show({
      title: '',
      content: `Are you sure you want to delete ${ids.length} selected items?`,
      buttons: [ 'delete', 'cancel.primary' ],
      wait: true,
      onApprove: () => {
        this.service.delete(ids).subscribe(null, error => this.error(error), () => {
          this.resetSelected();
          this.service.refresh().subscribe(null, null, () => this.alert.hide());
        });
      }
    });
  }

  get dateFilter(): (item) => boolean {
    return item => {
      return item._id && this._dateFilter(parseInt(item._id.substr(0, 8), 16) * 1000);
    };
  }

  protected resetSelected() {
    this.selected = [];
  }

  private _dateFilter(ts: number): boolean {
    let r = true;
    if (!!this.search.date.start && this.search.date.start > ts) {
      r = false;
    } else if (!!this.search.date.end && this.search.date.end < ts) {
      r = false;
    }
    return r;
  }

  private _fromDate(date: string): number {
    if (!date) return 0;
    return moment(date, 'YYYY-MM-DD').utc().unix() * 1000;
  }

  private _filter(x: T) {
    if (!!this.search.field) {
      return this.filters[this.search.field](x);
    } else {
      return _.some(this.filters, filter => filter(x));
    }
  }
}

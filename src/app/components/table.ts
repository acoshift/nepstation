import { Component } from 'angular2/core';
import { Observable, Subject } from 'rxjs';
import { Page, Id, Event, EventHandler } from '../models';
import moment = require('moment');

declare var $: any;

export abstract class TableComponent extends EventHandler {
  protected search = {
    keyword: '',
    field: '',
    date: {
      start: 0,
      end: 0,
    }
  };

  protected page: Page = {
    current: 0,
    total: 0,
    itemCount: 0,
    itemPerPage: 20,
  };

  protected loading = true;

  protected filter: (any) => boolean;

  private _list: Observable<any>;

  constructor(protected service: EventHandler) {
    super();
    service.observable.subscribe(
      event => {
        switch (event.name) {
          case 'delete':
            service.next({ name: 'refresh' });
            break;
        }
      },
      error => {
        $('#error').modal('show');
      }
    );

    this._list = this.service.observable
        .filter(event => event.name === 'list')
        .map(event => event.data)
        .map(xs => _.clone(xs).reverse())
        .flatMap<any>(x => Observable.create(emitter => {
          emitter.next(x);
          this.observable
            .filter(event => event.name === 'repeatFilter')
            .subscribe(() => emitter.next(x));
        }))
        .map(x => _.filter(x, y => this.dateFilter(y)))
        .map(x => _.filter(x, y => this.filter(y)))
        .map(x => {
          this.page.itemCount = _.isArray(x) && x.length || 0;
          this.emitter.next({ name: 'refreshPage' });
          return x;
        })
        .flatMap<any>(x => Observable.create(emitter => {
          emitter.next(x);
          this.observable
            .filter(event => event.name === 'repeatPage')
            .subscribe(() => emitter.next(x))
        }))
        .map(x => {
          let p = this.page.current * this.page.itemPerPage;
          let k = this.page.itemPerPage && p + this.page.itemPerPage || undefined;
          return _.slice(x, p, k);
        })
        .share();

    this.list.subscribe(r => {
      this.loading = r === null;
    });
    service.next({ name: 'refresh' });
  }

  onEvent(event: Event) {
    switch (event.name) {
      case 'gotoPage':
        this.emitter.next({ name: 'repeatPage' });
        break;
    }
  }

  refresh() {
    this.emitter.next({ name: 'repeatFilter' });
  }

  get list() {
    return this._list;
  }

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

  delete(item: Id) {
    // TODO: show modal on approve delete
    this.service.next({ name: 'delete', data: item._id });
  }

  get dateFilter(): (item) => boolean {
    return item => {
      return item._id && this._dateFilter(parseInt(item._id.substr(0, 8), 16) * 1000);
    };
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
}

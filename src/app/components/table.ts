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

  protected selected: any[] = [];

  private _list: Observable<any>;

  constructor(protected service: EventHandler) {
    super();
    service.observable.subscribe(
      event => this.onEvent(event),
      error => {
        this.emitter.next({
          name: 'alert',
          data: {
            title: '',
            content: error,
            buttons: [ 'ok' ]
          }
        });
      }
    );

    this._list = service.observable
        .filter(event => event.name === 'list')
        .map(event => event.data)
        .map(xs => _.clone(xs).reverse())
        .flatMap<any>(xs => Observable.create(emitter => {
          emitter.next(xs);
          this.observable
            .filter(event => event.name === 'repeatFilter')
            .subscribe(() => emitter.next(xs));
        }))
        .map(xs => _.filter(xs, x => this.dateFilter(x)))
        .map(xs => _.filter(xs, x => this.filter(x)))
        .do(xs => {
          this.page.itemCount = _.isArray(xs) && xs.length || 0;
          this.emitter.next({ name: 'refreshPage' });
        })
        .flatMap<any>(xs => Observable.create(emitter => {
          emitter.next(xs);
          this.observable
            .filter(event => event.name === 'repeatPage')
            .subscribe(() => emitter.next(xs));
        }))
        .map(xs => {
          let p = this.page.current * this.page.itemPerPage;
          let k = this.page.itemPerPage && p + this.page.itemPerPage || undefined;
          return _.slice(xs, p, k);
        })
        .share();

    this.list.subscribe(r => {
      this.loading = r === null;
      this.emitter.next({ name: 'alert.hide' });
    });
    service.next({ name: 'refresh' });
  }

  onEvent(event: Event) {
    switch (event.name) {
      case 'delete':
        this.service.next({ name: 'refresh' });
        break;
      case 'submit':
        this.service.next({ name: 'refresh' });
        break;
      case 'gotoPage':
        this.emitter.next({ name: 'repeatPage' });
        break;
      case 'error':
        this.emitter.next({
          name: 'alert',
          data: {
            title: '',
            content: event.data,
            buttons: [ 'ok' ]
          }
        });
        break;
      case 'loading':
        this.emitter.next({ name: 'loader', data: 'show' });
        break;
    }
  }

  refresh() {
    this.emitter.next({ name: 'repeatFilter' });
  }

  get list() {
    return this._list;
  }

  getName(item) {
    return item.name;
  }

  add() {
    this.emitter.next({ name: 'add' });
  }

  edit(item) {
    this.emitter.next({ name: 'edit', data: item });
  }

  delete(item) {
    this.emitter.next({
      name: 'alert',
      data: {
        title: '',
        content: `Are you sure you want to delete "${this.getName(item)}"?`,
        buttons: [ 'delete', 'cancel.primary' ],
        wait: true,
        onApprove: () => this.service.next({ name: 'delete', data: item._id })
      }
    });
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
      this.emitter.next({
        name: 'alert',
        data: {
          title: '',
          content: 'Please select items first.',
          buttons: [ 'ok' ]
        }
      });
      return;
    }
    this.emitter.next({
      name: 'alert',
      data: {
        title: '',
        content: `Are you sure you want to delete ${ids.length} selected items?`,
        buttons: [ 'delete', 'cancel.primary' ],
        wait: true,
        onApprove: () => {
          this.service.next({
            name: 'delete',
            data: ids
          });
          this.resetSelected();
        }
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
}

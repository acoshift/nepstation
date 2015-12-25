import { Pipe, PipeTransform, Injectable } from 'angular2/core';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { Observable, Subscriber } from 'rxjs';
import { Page } from '../models';
import _ = require('lodash');

@Pipe({ name: 'page', pure: false })
@Injectable()
export class PagePipe implements PipeTransform {
  _obj: Observable<any[]> = null;
  _emitter: Subscriber<any[]> = null;
  _observable: Observable<any[]> = null;
  _latestValue: any[] = null;
  _page: Page = null;
  _latestPage: Page = null;

  constructor() {
    this._observable = Observable.create(subscriber => {
      this._emitter = subscriber;
    });
  }

  transform(obj: Observable<any[]>, args?: any[]) {
    let emit = false;
    if (isBlank(this._page) && isPresent(args[0])) {
      this._page = args[0];
      this._latestPage = _.cloneDeep(this._page);
      emit = true;
    }
    if ((this._page.current !== this._latestPage.current) ||
        (this._page.itemPerPage !== this._latestPage.itemPerPage)) {
      this._latestPage = _.cloneDeep(this._page);
      emit = true;
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      obj.subscribe(x => {
        this._latestValue = x;
        this._emit();
      });
    }
    if (emit) this._emit();
    return this._observable;
  }

  _emit() {
    if (!this._latestValue) return;
    let p = this._page.current * this._page.itemPerPage;
    let k = this._page.itemPerPage && p + this._page.itemPerPage || undefined;
    this._emitter.next(_.slice(this._latestValue, p, k));
  }
}

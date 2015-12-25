import {
  Pipe,
  PipeTransform,
  Injectable,
  OnDestroy,
} from 'angular2/core';

import {
  isBlank,
  isPresent,
  isFunction,
  isNumber,
  isArray,
} from 'angular2/src/facade/lang';

import { Observable, Subscriber } from 'rxjs';

import { Page } from '../models';

import _ = require('lodash');

/**
 * The `reverse` pipe return an observable which reverse emitted values
 * from an input observable.
 */
@Pipe({ name: 'reverse', pure: true })
@Injectable()
export class ReversePipe implements PipeTransform {
  _obj: Observable<any[]> = null;
  _observable: Observable<any[]> = null;

  transform(obj: Observable<any[]>, args?: any[]): Observable<any[]> {
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      this._observable = obj.map(x => _.clone(x).reverse());
    }
    return this._observable;
  }
}

/**
 * The `filter` pipe return an observable which filter emitted values from
 * an input observable with input functions.
 */
@Pipe({ name: 'filter', pure: false })
@Injectable()
export class FilterPipe implements PipeTransform {
  _obj: Observable<any[]> = null;
  _emitter: Subscriber<any[]> = null;
  _observable: Observable<any[]> = null;
  _latestValue: any[] = null;
  _filters: Function[] = null;

  constructor() {
    this._observable = Observable.create(subscriber => {
      this._emitter = subscriber;
    }).share();
  }

  transform(obj: Observable<any[]>, args?: Function[]): Observable<any[]> {
    if (isBlank(this._filters)) {
      this._filters = args;
      this._do();
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      obj.subscribe(x => {
        this._latestValue = x;
        this._do();
      });
    }
    return this._observable;
  }

  _do() {
    if (isBlank(this._latestValue)) return;
    let result = this._latestValue;
    _.forEach(this._filters, x => result = _.filter(result, y => x(y)));
    this._emitter.next(result);
  }
}

/**
 * The `repeat` pipe return an observable which re-emit latest value from an input observable
 * when an observable from argument emitted.
 */
@Pipe({ name: 'repeat', pure: true })
@Injectable()
export class RepeatPipe implements PipeTransform {
  _obj: Observable<any> = null;
  _receiver: Observable<void> = null;
  _emitter: Subscriber<any> = null;
  _observable: Observable<any> = null;
  _latestValue: any = null;

  constructor() {
    this._observable = Observable.create(subscriber => {
      this._emitter = subscriber;
    });
  }

  transform(obj: Observable<any>, args?: any[]): Observable<any[]> {
    if (isBlank(this._receiver) && isPresent(args[0])) {
      this._receiver = args[0];
      this._receiver.subscribe(() => this._emit());
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      obj.subscribe(x => {
        this._latestValue = x;
        this._emit();
      });
    }
    return this._observable;
  }

  _emit() {
    if (!this._latestValue) return;
    this._emitter.next(this._latestValue);
  }
}

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

@Pipe({ name: 'count', pure: true })
@Injectable()
export class CountPipe implements PipeTransform {
  _obj: Observable<any[]> = null;
  _page: Page = null;

  transform(obj: Observable<any[]>, args?: any[]) {
    if (isBlank(this._page) && isPresent(args[0])) {
      this._page = args[0];
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      obj.subscribe(x => this._page.itemCount = isArray(x) && x.length || 0);
    }
    return this._obj;
  }
}

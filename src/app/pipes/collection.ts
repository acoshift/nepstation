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
} from 'angular2/src/facade/lang';

import { Observable, Subject } from 'rxjs';

import _ = require('lodash');

/**
 * The `reverse` pipe return an observer which reverse emitted values
 * from an input observer.
 */
@Pipe({ name: 'reverse', pure: true })
@Injectable()
export class ReversePipe implements PipeTransform, OnDestroy {
  _obj: Observable<any[]> = null;
  _observable: Observable<any[]> = null;

  ngOnDestroy() {
    this._obj = null;
    this._observable = null;
  }

  transform(obj: Observable<any[]>, args?: any[]): Observable<any[]> {
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      this._observable = obj.map(x => _(x).reverse().value());
    }
    return this._observable;
  }
}

/**
 * The `filter` pipe return an observer which filter emitted values from
 * an input observer with input functions.
 */
@Pipe({ name: 'filter', pure: true })
@Injectable()
export class FilterPipe implements PipeTransform, OnDestroy {
  _obj: Observable<any[]> = null;
  _observable: Observable<any[]> = null;
  _emitter: Subject<any[]> = null;
  _latestValue: any[] = null;
  _filters: Function[] = null;

  ngOnDestroy() {
    this._obj = null;
    this._observable = null;
    this._emitter = null;
    this._latestValue = null;
    this._filters = null;
  }

  transform(obj: Observable<any[]>, args?: Function[]): Observable<any[]> {
    if (isBlank(this._filters)) {
      this._filters = args;
      this._do();
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      this._emitter = new Subject();
      this._observable = this._emitter.share();
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
 * The `repeat` pipe return an observer which re-emit latest value from an input observer
 * when an observer from argument emitted.
 */
@Pipe({ name: 'repeat', pure: true })
@Injectable()
export class RepeatPipe implements PipeTransform, OnDestroy {
  _obj: Observable<any> = null;
  _receiver: Observable<void> = null;
  _observable: Observable<any> = null;
  _emitter: Subject<any> = null;
  _latestValue: any = null;

  ngOnDestroy() {
    this._obj = null;
    this._receiver = null;
    this._observable = null;
    this._emitter = null;
    this._latestValue = null;
  }

  transform(obj: Observable<any>, args?: any[]): Observable<any[]> {
    if (isBlank(this._receiver) && isPresent(args[0])) {
      this._receiver = args[0];
      this._receiver.subscribe(() => this._emit());
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj;
      this._emitter = new Subject();
      this._observable = this._emitter.share();
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

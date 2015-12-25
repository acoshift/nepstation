import { Pipe, PipeTransform, Injectable } from 'angular2/core';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { Observable, Subscriber } from 'rxjs';

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

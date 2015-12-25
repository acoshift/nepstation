import { Pipe, PipeTransform, Injectable } from 'angular2/core';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { Observable } from 'rxjs';
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

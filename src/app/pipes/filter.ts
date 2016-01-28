import { Pipe, PipeTransform, Injectable } from 'angular2/core'
import { isBlank, isPresent } from 'angular2/src/facade/lang'
import { Observable, Subscriber } from 'rxjs'

/**
 * The `filter` pipe return an observable which filter emitted values from
 * an input observable with input functions.
 */
@Pipe({ name: 'filter', pure: false })
@Injectable()
export class FilterPipe implements PipeTransform {
  _obj: Observable<any[]> = null
  _emitter: Subscriber<any[]> = null
  _observable: Observable<any[]> = null
  _latestValue: any[] = null
  _filters: Function[] = null

  constructor () {
    this._observable = Observable.create(subscriber => {
      this._emitter = subscriber
    }).share()
  }

  transform (obj: Observable<any[]>, args?: Function[]): Observable<any[]> {
    if (isBlank(this._filters)) {
      this._filters = args
      this._do()
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj
      obj.subscribe(x => {
        this._latestValue = x
        this._do()
      })
    }
    return this._observable
  }

  _do () {
    if (isBlank(this._latestValue)) return
    let result = this._latestValue
    _.forEach(this._filters, x => result = _.filter(result, y => x(y)))
    this._emitter.next(result)
  }
}

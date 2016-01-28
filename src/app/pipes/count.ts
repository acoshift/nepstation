import { Pipe, PipeTransform, Injectable } from 'angular2/core'
import { isBlank, isPresent, isArray } from 'angular2/src/facade/lang'
import { Observable } from 'rxjs'
import { Page } from '../models'

@Pipe({ name: 'count', pure: true })
@Injectable()
export class CountPipe implements PipeTransform {
  _obj: Observable<any[]> = null
  _page: Page = null

  transform (obj: Observable<any[]>, args?: any[]) {
    if (isBlank(this._page) && isPresent(args[0])) {
      this._page = args[0]
    }
    if (isBlank(this._obj) && isPresent(obj)) {
      this._obj = obj
      obj.subscribe(x => this._page.itemCount = isArray(x) && x.length || 0)
    }
    return this._obj
  }
}

import { Component, EventEmitter } from 'angular2/core'
import { Page } from '../models'
import * as _ from 'lodash'

@Component({
  selector: 'pagination',
  template: require('./pagination.jade'),
  inputs: [
    'page'
  ],
  events: [
    'pageChange'
  ]
})
export class PaginationComponent {
  pages: number[]

  pageChange: EventEmitter<Page> = new EventEmitter()

  private _page: Page

  refresh () {
    this.page.current = 0
    this._refresh()
  }

  set page (page: Page) {
    this._page = page
    this.refresh()
  }

  get page () {
    return this._page
  }

  gotoPage (page: number) {
    if (page < 0) return
    this.page.current = page
    this.pageChange.emit(this.page)
    this._refresh()
  }

  nextPage () {
    if (this.page.current < this.page.total - 1)
      this.gotoPage(this.page.current + 1)
  }

  prevPage () {
    if (this.page.current > 0)
      this.gotoPage(this.page.current - 1)
  }

  private _refresh () {
    this.page.total = Math.ceil(this.page.itemCount / this.page.itemPerPage)
    let r = []
    if (this.page.current - 2 > 0) r = [0, -1]
    r = r.concat(_.range(Math.max(this.page.current - 2, 0), Math.min(this.page.current + 3, this.page.total)))
    if (this.page.current + 3 < this.page.total) r = r.concat([-1, this.page.total - 1])
    this.pages = r
  }
}

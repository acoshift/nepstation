import { Observable } from 'rxjs'
import { Page, Id } from '../models'
import { AlertComponent } from './alert'
import { ModelDialog } from './modeldialog'
import { PaginationComponent } from './pagination'
import { ModelService } from '../services/model'
import * as moment from 'moment'

declare let $: any

export abstract class TableComponent<T extends Id> {
  protected search = {
    keyword: '',
    field: '',
    date: {
      start: 0,
      end: 0,
    }
  }

  protected loading: boolean

  protected selected: any[] = []

  protected alert: AlertComponent

  protected dialog: ModelDialog<T>

  protected pagination: PaginationComponent

  protected filters: { [ key: string ]: Function }

  protected importProgress = {
    current: 0,
    total: 0
  }

  private _list: T[] = null

  private _page: Page = {
    current: 0,
    total: 0,
    itemCount: 0,
    itemPerPage: 20,
  }

  private _repeatFilter = () => {}
  private _repeatPage = () => {}

  constructor (protected service: ModelService<T>) {
    this.loading = true
    this.service.list
      .filter(xs => !!xs)
      .map(xs => _.clone(xs).reverse())
      .flatMap<T[]>(xs => Observable.create(emitter => {
        emitter.next(xs)
        this._repeatFilter = () => { emitter.next(xs) }
      }))
      .map(xs => _.filter(xs, x => this.dateFilter(x)))
      .map(xs => _.filter(xs, x => this._filter(x)))
      .do(xs => {
        this.page.itemCount = _.isArray(xs) && xs.length || 0
        if (this.pagination) this.pagination.page = this.page
      })
      .flatMap<T[]>(xs => Observable.create(emitter => {
        emitter.next(xs)
        this._repeatPage = () => { emitter.next(xs) }
      }))
      .map(xs => {
        let p = this.page.current * this.page.itemPerPage
        let k = this.page.itemPerPage && p + this.page.itemPerPage || undefined
        return _.slice(xs, p, k)
      })
      .subscribe(r => {
        this._list = r
      })

    this.service.refresh().subscribe(null, null, () => {
      if (this.loading) {
        this.loading = false
      }
    })
  }

  error (item: Id): void {
    this.alert.show({
      title: item.error.name,
      content: item.error.message,
      buttons: [ 'ok' ]
    })
  }

  refresh (): void {
    this.service.refresh()
  }

  get list (): T[] {
    return this._list
  }

  get page (): Page {
    return this._page
  }

  set page (page: Page) {
    this._page = page
    this._repeatPage()
  }

  getName (item: T): string {
    return (<any> item).name
  }

  add (): void {
    this.dialog.showAdd()
  }

  edit (item, e): void {
    this.dialog.showEdit(item, e)
  }

  delete (item): void {
    this.alert.show({
      title: '',
      content: `Are you sure you want to delete "${this.getName(item)}"?`,
      buttons: [ 'delete', 'cancel.primary' ],
      wait: true,
      onApprove: () => this.service.delete(item._id).subscribe(
        null,
        error => this.error(error),
        () => {
          this.service.refresh().subscribe(null, null, () => {
            this.alert.hide()
          })
        })
    })
  }

  view (item: T, e?): void {
    if (e) e.loading = true
    this.service.read(item._id).subscribe(
      result => this.alert.show({
        title: `View: "${result._id}"`,
        code: JSON.stringify(result, null, 4),
        buttons: [ 'ok' ]
      }),
      error => this.error(error),
      () => {
        if (e) e.loading = false
      }
    )
  }

  setStartDate (date: string): void {
    this.search.date.start = this._fromDate(date)
    this._repeatFilter()
  }

  setEndDate (date: string): void {
    this.search.date.end = this._fromDate(date)
    this._repeatFilter()
  }

  setField (field: string): void {
    this.search.field = field
    this._repeatFilter()
  }

  setKeyword (keyword: string): void {
    this.search.keyword = keyword
    this._repeatFilter()
  }

  select (item, value?: boolean): boolean | void {
    if (_.isUndefined(value)) {
      return _.some(this.selected, x => x === item)
    }
    if (value) {
      this.selected.push(item)
    } else {
      _.remove(this.selected, x => x === item)
    }
  }

  deleteSelected (): void {
    let ids = _(this.selected).map(x => x._id).value()
    if (!ids.length) {
      this.alert.show({
        title: '',
        content: 'Please select items first.',
        buttons: [ 'ok' ]
      })
      return
    }
    this.alert.show({
      title: '',
      content: `Are you sure you want to delete ${ids.length} selected items?`,
      buttons: [ 'delete', 'cancel.primary' ],
      wait: true,
      onApprove: () => {
        this.service.delete(ids).subscribe(null, error => this.error(error), () => {
          this.resetSelected()
          this.service.refresh().subscribe(null, null, () => this.alert.hide())
        })
      }
    })
  }

  import (file) {
    // TODO: optimize
    this.importProgress = {
      current: 0,
      total: 0
    }
    let reader = new FileReader()
    reader.onload = loadEvent => {
      let arr: string[] = (<any> loadEvent.target).result.split(/\r?\n/)
      let parse = (src: string) => {
        let d = false
        let s = ''
        let a: string
        let o = []
        for (a of src) {
          if (a === '"') d = !d
          if (a === '\t' && !d) {
            o.push(s)
            s = ''
          } else {
            s += a
          }
        }
        return o
      }
      let header = parse(arr[0])
      this.importProgress.total = arr.length - 1
      let work = (_i, n) => {
        let objs = []
        let o, k
        let i: number
        for (i = _i; i < n && i < _i + 100; ++i) {
          o = parse(arr[i])
          if (o.length !== header.length) --this.importProgress.total
          if (o.length === header.length) {
            k = {}
            _.forEach(header, (v, i) => {
              _.set(k, v, o[i])
            })
            objs.push(k)
          }
        }
        this.service.create(objs).subscribe(
          result => {
            this.importProgress.current += objs.length
          },
          error => {
            this.importProgress.current += objs.length
            // TODO: error handleing
          },
          () => {
            work(i, n)
            if (this.importProgress.current === this.importProgress.total) {
              this.importProgress.current = 0
              this.importProgress.total = 0
              // this.service.refresh()
            }
          }
        )
      }
      let p
      let n = 5
      for (p = 0; p < n; ++p) {
        work(1 + Math.floor((arr.length / n) * p), Math.floor((arr.length / n) * (p + 1)))
      }
    }
    reader.readAsText(file.files[0])
  }

  get dateFilter (): (item) => boolean {
    return item => {
      return item._id && this._dateFilter(parseInt(item._id.substr(0, 8), 16) * 1000)
    }
  }

  protected resetSelected (): void {
    this.selected = []
  }

  private _dateFilter (ts: number): boolean {
    let r = true
    if (!!this.search.date.start && this.search.date.start > ts) {
      r = false
    } else if (!!this.search.date.end && this.search.date.end < ts) {
      r = false
    }
    return r
  }

  private _fromDate (date: string): number {
    if (!date) return 0
    return moment(date, 'YYYY-MM-DD').utc().unix() * 1000
  }

  private _filter (x: T): boolean {
    if (!!this.search.field) {
      return this.filters[this.search.field](x)
    } else {
      return _.some(this.filters, filter => filter(x))
    }
  }
}

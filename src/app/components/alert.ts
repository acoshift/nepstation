import { Component, ElementRef, AfterViewInit, ViewQuery, QueryList } from 'angular2/core'
declare let $: any

interface AlertOption {
  title?: string
  content?: string
  code?: string
  buttons?: string[]
  wait?: boolean
  closable?: boolean
  allowMultiple?: boolean
  offset?: number
  transition?: string
  duration?: number
  onShow?: Function
  onVisible?: Function
  onHide?: Function
  onHidden?: Function
  onApprove?: Function
  onDeny?: Function
}

@Component({
  selector: 'alert',
  template: require('./alert.jade')
})
export class AlertComponent implements AfterViewInit {
  title: string = ''
  content: string = ''
  code: string = ''
  buttons: string[] = []
  wait: boolean = false

  private _modal = null
  private _loading: boolean = false

  constructor(@ViewQuery('modal') private _el: QueryList<ElementRef>) {}

  ngAfterViewInit () {
    this._modal = $(this._el.first.nativeElement)
  }

  show (opt?: AlertOption) {
    if (!opt) opt = {}
    this._loading = false
    this.title = opt.title || ''
    this.content = opt.content || ''
    this.code = opt.code || ''
    this.buttons = opt.buttons || [ 'ok' ]
    this.wait = opt.wait || false
    this._modal
      .modal({
        closable: opt.closable || false,
        allowMultiple: opt.allowMultiple || true,
        observeChanges: true,
        offset: opt.offset || Number.POSITIVE_INFINITY,
        transition: opt.transition,
        duration: opt.duration,
        onShow: opt.onShow,
        onVisible: opt.onVisible,
        onHide: opt.onHide,
        onHidden: opt.onHidden,
        onApprove: () => {
          if (_.isFunction(opt.onApprove)) opt.onApprove()
          if (this.wait) {
            this._loading = true
            return false
          }
        },
        onDeny: opt.onDeny
      })
      .modal('show')
  }

  hide () {
    this._modal.modal('hide')
    this._loading = false
  }
}

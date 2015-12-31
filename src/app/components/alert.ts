import { Component, ElementRef } from 'angular2/core';
import { Event } from '../models';
import { EventComponent } from './event';
declare var $: any;

interface AlertOption {
  title?: string;
  content?: string;
  code?: string;
  buttons?: string[];
  wait?: boolean;
  closable?: boolean;
  allowMultiple?: boolean;
  offset?: number;
  transition?: string;
  duration?: number;
  onShow?: Function;
  onVisible?: Function;
  onHide?: Function;
  onHidden?: Function;
  onApprove?: Function;
  onDeny?: Function;
}

@Component({
  selector: '.alert',
  host: {
    class: 'ui long modal'
  },
  template: require('./alert.jade')
})
export class AlertComponent {
  title: string = '';
  content: string = '';
  code: string = '';
  buttons: string[] = [];
  wait: boolean = false;

  private _loading: boolean = false;

  constructor(private e: ElementRef) {}

  show(opt?: AlertOption) {
    if (!opt) opt = {};
    this._loading = false;
    this.title = opt.title || '';
    this.content = opt.content || '';
    this.code = opt.code || '';
    this.buttons = opt.buttons || [ 'ok' ];
    this.wait = opt.wait || false;
    $(this.e.nativeElement)
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
          if (_.isFunction(opt.onApprove)) opt.onApprove();
          if (this.wait) {
            this._loading = true;
            return false;
          };
        },
        onDeny: opt.onDeny
      })
      .modal('show');
  }

  hide() {
    $(this.e.nativeElement).modal('hide');
    this._loading = false;
  }
}

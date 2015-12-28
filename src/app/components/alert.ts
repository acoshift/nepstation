import { Component, ElementRef } from 'angular2/core';
import { Event } from '../models';
import { EventComponent } from './event';
declare var $: any;

@Component({
  selector: '.alert',
  host: {
    class: 'ui long modal'
  },
  template: require('./alert.jade')
})
export class AlertComponent extends EventComponent {
  title: string = '';
  content: string = '';
  code: string = '';
  buttons: string[] = [];
  wait: boolean = false;

  private _loading: boolean = false;

  constructor(private e: ElementRef) {
    super();
  }

  onEvent(event: Event) {
    if (event.name === 'alert') {
      this._loading = false;
      this.title = event.data.title || '';
      this.content = event.data.content || '';
      this.code = event.data.code || '';
      this.buttons = event.data.buttons || [ 'ok' ];
      this.wait = event.data.wait || false;
      $(this.e.nativeElement)
        .modal({
          closable: event.data.closable || false,
          allowMultiple: event.data.allowMultiple || true,
          observeChanges: true,
          offset: event.data.offset || Number.POSITIVE_INFINITY,
          transition: event.data.transition,
          duration: event.data.duration,
          onShow: event.data.onShow,
          onVisible: event.data.onVisible,
          onHide: event.data.onHide,
          onHidden: event.data.onHidden,
          onApprove: () => {
            event.data.onApprove();
            if (this.wait) {
              this._loading = true;
              return false;
            };
          },
          onDeny: event.data.onDeny
        })
        .modal('show');
    } else if (event.name === 'alert.hide') {
      $(this.e.nativeElement).modal('hide');
      this._loading = false;
    }
  }
}

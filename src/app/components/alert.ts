import { Component, ElementRef } from 'angular2/core';
import { Event } from '../models';
import { EventComponent } from './event';
declare var $: any;

@Component({
  selector: '.alert',
  host: {
    class: 'ui small modal'
  },
  template: require('./alert.jade')
})
export class AlertComponent extends EventComponent {
  title: string = '';
  content: string = '';
  buttons: string[] = [];

  constructor(private e: ElementRef) {
    super();
  }

  onEvent(event: Event) {
    if (event.name === 'alert') {
      this.title = event.data.title;
      this.content = event.data.content;
      this.buttons = event.data.buttons;
      $(this.e.nativeElement)
        .modal({
          closable: event.data.closable || false,
          allowMultiple: event.data.allowMultiple || true,
          transition: event.data.transition,
          duration: event.data.duration,
          onShow: event.data.onShow,
          onVisible: event.data.onVisible,
          onHide: event.data.onHide,
          onHidden: event.data.onHidden,
          onApprove: event.data.onApprove,
          onDeny: event.data.onDeny
        })
        .modal('show');
    }
  }
}

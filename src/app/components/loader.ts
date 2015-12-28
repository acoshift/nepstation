import { Component, View, ElementRef } from 'angular2/core';
import { EventComponent } from './event';
import { Event } from '../models';
declare var $: any;

@Component({
  selector: 'loader',
  host: {
    class: 'ui basic modal'
  }
})
@View({
  template: `<div class="ui large loader"></div>`
})
export class LoaderComponent extends EventComponent {
  constructor(protected element: ElementRef) {
    super();
  }

  onEvent(event: Event) {
    if (event.name === 'loader') {
      if (event.data === 'show') {
        $(this.element.nativeElement)
          .modal({
            closable: false,
            allowMultiple: true
          })
          .modal('show');
      } else if (event.data === 'hide') {
        $(this.element.nativeElement).modal('hide');
      }
    }
  }
}

import { Directive, AfterViewInit, ElementRef } from 'angular2/core';
import { EventComponent } from '../components';
import { Event } from '../models';

declare var $: any;

@Directive({
  selector: '.dropdown'
})
export class DropdownDirective extends EventComponent implements AfterViewInit {
  constructor(private e: ElementRef) {
    super();
  }

  ngAfterViewInit() {
    $(this.e.nativeElement).dropdown({
      match: 'text',
      fullTextSearch: true
    });
  }

  onEvent(event: Event) {
    if (event.name === 'dropdown') {
      $(this.e.nativeElement).dropdown(...event.data);
    }
  }
}

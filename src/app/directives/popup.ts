import { Directive, AfterViewInit, ElementRef } from 'angular2/core';

declare var $: any;

@Directive({
  selector: '[data-content]'
})
export class PopupDirective implements AfterViewInit {
  constructor(private e: ElementRef) {}

  ngAfterViewInit() {
    $(this.e.nativeElement).popup();
  }
}

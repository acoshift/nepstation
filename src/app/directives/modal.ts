import { Directive, AfterViewInit, ElementRef } from 'angular2/core';

declare var $: any;

@Directive({
  selector: '.modal'
})
export class ModalDirective implements AfterViewInit {
  constructor(private e: ElementRef) {}

  ngAfterViewInit() {
    $(this.e.nativeElement).modal({ closable: false, allowMultiple: false });
  }
}

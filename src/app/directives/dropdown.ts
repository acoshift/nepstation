import { Directive, AfterViewInit, ElementRef } from 'angular2/core';

declare var $: any;

@Directive({
  selector: '.dropdown'
})
export class DropdownDirective implements AfterViewInit {
  constructor(private e: ElementRef) {}

  ngAfterViewInit() {
    $(this.e.nativeElement).dropdown();
  }
}

import { Directive, AfterViewInit, ElementRef } from 'angular2/core';

declare var $: any;

@Directive({
  selector: '.checkbox'
})
export class CheckboxDirective implements AfterViewInit {
  constructor(private e: ElementRef) {}

  ngAfterViewInit() {
    $(this.e.nativeElement).checkbox();
  }
}

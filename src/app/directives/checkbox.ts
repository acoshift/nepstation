import { Directive, AfterViewInit, ElementRef } from 'angular2/core';

declare var $: any;

@Directive({
  selector: '.ui.checkbox'
})
export class CheckboxDirective implements AfterViewInit {
  constructor(private _elementRef: ElementRef) {}

  ngAfterViewInit() {
    $(this._elementRef.nativeElement).checkbox();
  }
}

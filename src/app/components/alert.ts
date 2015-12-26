import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
} from 'angular2/core';

declare var $: any;

@Component({
  selector: '.alert',
  host: {
    class: 'ui small modal'
  },
  template: require('./alert.jade'),
  inputs: [ 'title', 'content' ],
  outputs: []
})
export class AlertComponent implements AfterViewInit {
  title: string;
  content: string;

  constructor(private e: ElementRef) {}

  ngAfterViewInit() {
    $(this.e.nativeElement).modal({ closable: false, allowMultiple: false });
  }

  a() {
    console.log('aaa');
  }
}

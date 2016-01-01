import { Component, View, ElementRef, AfterViewInit, ViewQuery, QueryList } from 'angular2/core';
declare var $: any;

@Component({
  selector: 'indicator'
})
@View({
  template: `<div #modal class="ui basic modal">` +
              `<div class="ui large loader"></div>` +
            `</div>`
})
export class IndicatorComponent implements AfterViewInit {
  private _modal = null;

  constructor(@ViewQuery('modal') private _el: QueryList<ElementRef>) {}

  ngAfterViewInit() {
    this._modal = $(this._el.first.nativeElement);
  }

  show() {
    this._modal
      .modal({
        closable: false,
        allowMultiple: true
      })
      .modal('show');
  }

  hide() {
    this._modal.modal('hide');
  }
}

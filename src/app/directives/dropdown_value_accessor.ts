import { Provider, forwardRef, Directive, AfterViewInit, ElementRef } from 'angular2/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from 'angular2/common'
import { CONST_EXPR } from 'angular2/src/facade/lang'
declare let $: any

const DROPDOWN_VALUE_ACCESSOR = CONST_EXPR(
  new Provider(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => DropdownControlValueAccessor), multi: true }))

@Directive({
  selector: '.ui.dropdown',
  host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
  bindings: [ DROPDOWN_VALUE_ACCESSOR ]
})
export class DropdownControlValueAccessor implements ControlValueAccessor, AfterViewInit {
  onChange = (_) => {}
  onTouched = () => {}

  private _defaultText: string

  constructor (private _elementRef: ElementRef) {
    this._defaultText = $(this._elementRef.nativeElement).find('.default.text').text()
  }

  writeValue (value: any): void {
    if (!value) {
      $(this._elementRef.nativeElement).dropdown('clear')
      $(this._elementRef.nativeElement).find('.default.text').text(this._defaultText)
    } else {
      $(this._elementRef.nativeElement).dropdown('set selected', value)
    }
  }

  registerOnChange (fn: (_: any) => {}): void { this.onChange = fn }

  registerOnTouched (fn: () => {}): void { this.onTouched = fn }

  ngAfterViewInit (): void {
    $(this._elementRef.nativeElement).dropdown({
      match: 'text',
      fullTextSearch: true,
      onChange: this.onChange
    })
  }
}

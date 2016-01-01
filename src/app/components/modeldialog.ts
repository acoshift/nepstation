import { ControlGroup, Control } from 'angular2/common';
import { ElementRef, AfterViewInit, QueryList } from 'angular2/core';
import { ModelService } from '../services/model';
declare var $: any;

interface ModelDialogOption {
  header?: string;
  button?: string;
  model?: any;
  closable?: boolean;
  allowMultiple?: boolean;
  offset?: number;
  transition?: string;
  duration?: number;
}

export abstract class ModelDialog<T> implements AfterViewInit {
  protected model: ControlGroup;
  protected header: string = '';
  protected button: string = '';
  protected loading: boolean = false;
  private _modal;

  constructor(
    private _elementRef: ElementRef,
    protected service: ModelService<T>) {}

  ngAfterViewInit() {
    this._modal = $(this._elementRef.nativeElement).find('.ui.modal');
  }

  show(opt: ModelDialogOption) {
    this.loading = false;
    this.header = opt.header || '';
    this.button = opt.button || '';
    this.setModel(opt.model);
    this._modal
      .modal({
        closable: opt.closable || false,
        allowMultiple: opt.allowMultiple || true,
        observeChanges: true,
        offset: opt.offset || Number.POSITIVE_INFINITY,
        transition: opt.transition,
        duration: opt.duration,
        onApprove: () => { this._submit(); return false; },
      })
      .modal('show');
  }

  showAdd() { /* Override */}

  showEdit(item) { /* Override */ }

  hide() {
    this._modal.modal('hide');
    this.loading = false;
  }

  protected setModel(data: any) {
    this.resetModel();
    if (!data) return;
    function __set(model, data) {
      _.forOwn(model, (control: any, key: string) => {
        if (control.controls && _.isPlainObject(data[key])) {
          __set(control.controls, data[key]);
        } else {
          control.validator = data[key][1];
          control.updateValue(data[key][0]);
        }
      });
    }
    __set(this.model.controls, data);
  }

  protected resetModel() {
    function __reset(model) {
      _.forOwn(model, (control: any) => {
        if (control.controls) {
          __reset(control.controls);
        } else {
          control.validator = null;
          control.updateValue('');
          control._touched = false;
        }
      });
    }
    __reset(this.model.controls);
  }

  protected valid(name: string) {
    return this.model.controls[name].touched && !this.model.controls[name].valid;
  }

  protected preSubmit(data) {
    // override to edit model before submit
    return data;
  }

  private _markAsTouched() {
    function __mark(model) {
      _.forOwn(model, (control: any) => {
        if (control.controls) {
          __mark(control.controls);
        } else {
          control.markAsTouched();
        }
      });
    }
    __mark(this.model.controls);
  }

  private _submit() {
    this._markAsTouched();
    if (!this.model.valid) return;
    let v = this.preSubmit(this.model.value);
    if (v === null || typeof v === 'undefined') return;
    this.loading = true;
    this.service.submit(v).subscribe(
      result => { /* empty */ },
      error => { /* TODO: Error handle */ },
      () => this.hide()
    );
  }
}

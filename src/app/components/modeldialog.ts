import { Event, EventHandler } from '../models';
import { EventComponent } from './event';
import { ControlGroup, Control } from 'angular2/common';
import { ElementRef } from 'angular2/core';
declare var $: any;

export abstract class ModelDialog extends EventComponent {
  protected model: ControlGroup;
  protected header: string = '';
  protected button: string = '';

  constructor(
    protected element: ElementRef,
    protected service: EventHandler) {
    super();
    service.observable.subscribe(event => {
      if (event.name === 'submit') {
        $(this.element.nativeElement).modal('hide');
      }
    })
  }

  onEvent(event: Event) {
    switch (event.name) {
      case 'modelDialog':
        this.header = event.data.header || '';
        this.button = event.data.button || '';
        this.setModel(event.data.model);
        $(this.element.nativeElement)
          .modal({
            closable: event.data.closable || false,
            allowMultiple: event.data.allowMultiple || true,
            observeChanges: true,
            offset: event.data.offset || Number.POSITIVE_INFINITY,
            transition: event.data.transition,
            duration: event.data.duration,
            onApprove: () => { this._submit(); return false; },
          })
          .modal('show');
        break;
    }
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

  protected preSubmit() {
    // override to edit model before submit
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
    this.preSubmit();
    this.service.next({ name: 'submit', data: this.model.value });
  }
}

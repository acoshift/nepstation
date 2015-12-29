import { Component, View, ElementRef } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, RolesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import { Role, Event } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: '.dialog',
  host: {
    class: 'ui long modal'
  }
})
@View({
  template: require('./role.dialog.jade'),
  directives: [ Directives ]
})
class RoleDialog extends ModelDialog {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required]
  };

  private _dbs: any[] = [];
  private _admin: boolean = false;
  private _onlyOwner: boolean = false;

  constructor(
    e: ElementRef,
    service: RolesService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);
  }

  onEvent(event: Event) {
    super.onEvent(event);
    switch (event.name) {
      case 'add':
        this._dbs = [];
        this._admin = false;
        this._onlyOwner = false;
        super.onEvent({
          name: 'modelDialog',
          data: {
            header: 'Add Role',
            button: 'Add',
            model: this._modelTemplate
          }
        });
        break;
      case 'edit':
        if (event.data.dbs === 1) {
          this._admin = true;
          this._onlyOwner = false;
        } else if (event.data.dbs === 2) {
          this._admin = true;
          this._onlyOwner = true;
        } else {
          this._admin = false;
          this._onlyOwner = false;
        }
        this._toList(event.data.dbs);
        super.onEvent({
          name: 'modelDialog',
          data: {
            header: 'Edit Role: ' + event.data.name,
            button: 'Update',
            model: {
              _id: [event.data._id],
              name: [event.data.name, Validators.required]
            }
          }
        });
        break;
    }
  }

  preSubmit(data) {
    let valid = true;
    data.dbs = {};
    _.forEach(this._dbs, v => {
      if (!valid) return;
      if (v.name === '') {
        valid = false;
        return;
      }
      if (v.actions.a.a) {
        _.set(data.dbs, v.name, 1);
        return;
      }
      if (v.actions.a.o) {
        _.set(data.dbs, v.name, 2);
        return;
      }
      if (v.actions.c) _.set(data.dbs, v.name + '.c', 1);
      if (v.actions.r.a) _.set(data.dbs, v.name + '.r', 1);
      if (v.actions.r.o) _.set(data.dbs, v.name + '.r', 2);
      if (v.actions.u.a) _.set(data.dbs, v.name + '.u', 1);
      if (v.actions.u.o) _.set(data.dbs, v.name + '.u', 2);
      if (v.actions.d.a) _.set(data.dbs, v.name + '.d', 1);
      if (v.actions.d.o) _.set(data.dbs, v.name + '.d', 2);
    });
    return valid && data || null;
  }

  add() {
    this._dbs.push({
      name: '',
      actions: {
        c: false,
        r: { a: false, o: false },
        u: { a: false, o: false },
        d: { a: false, o: false },
        a: { a: false, o: false }
      }
    });
  }

  delete(item) {
    _.remove(this._dbs, x => x === item);
  }

  private _toList(dbs: any) {
    let __toActions = (v) => {
      return {
        c: v.c === 1,
        r: { a: v.r === 1, o: v.r === 2 },
        u: { a: v.u === 1, o: v.u === 2 },
        d: { a: v.d === 1, o: v.d === 2 },
        a: { a: v === 1, o: v === 2 }
      };
    };

    let __to = (dbs, prefix) => {
      _.forOwn(dbs, (v, k) => {
        let hasDeep = false;
        _.forEach(v, (v, k) => {
          if (_.isPlainObject(v)) hasDeep = true;
        });
        if (hasDeep) return __to(v, k + '.');
        this._dbs.push({
          name: prefix + k,
          actions: __toActions(v)
        });
      });
    };

    this._dbs = [];
    __to(dbs, '');
  }

  private _disable(t, action: string) {
    switch (action) {
      case 'c':
        return t.actions.a.a || t.actions.a.o;
      case 'r.a':
        return t.actions.a.a || t.actions.a.o || t.actions.r.o;
      case 'r.o':
        return t.actions.a.a || t.actions.a.o || t.actions.r.a;
      case 'u.a':
        return t.actions.a.a || t.actions.a.o || t.actions.u.o;
      case 'u.o':
        return t.actions.a.a || t.actions.a.o || t.actions.u.a;
      case 'd.a':
        return t.actions.a.a || t.actions.a.o || t.actions.d.o;
      case 'd.o':
        return t.actions.a.a || t.actions.a.o || t.actions.d.a;
      case 'a.a':
        return t.actions.a.o;
      case 'a.o':
        return t.actions.a.a;
    }
  }

  private _attrDisable(t, action: string): any {
    if (this._disable(t, action)) {
      return true;
    }
    return null;
  }
}

@Component({})
@View({
  template: require('./roles.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    RoleDialog,
    Directives,
  ]
})
export class RolesRoute extends TableComponent {
  constructor(
    navbar: NavbarService,
    service: RolesService) {
    super(service);
    navbar.active('admin/roles');
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x.name.indexOf(this.search.keyword) !== -1;
        case 'name':
          return x.name.indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }
}

import { Component, View, ElementRef } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { NavbarService, UsersService, RolesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { User, Role, Event } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: '.dialog',
  host: {
    class: 'ui long modal'
  }
})
@View({
  template: require('./user.dialog.jade'),
  directives: [ Directives ]
})
class UserDialog extends ModelDialog {
  roles: Role[];

  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    pwd: ['', Validators.required],
    enabled: [false],
    role: ['']
  };

  constructor(
    e: ElementRef,
    service: UsersService,
    fb: FormBuilder,
    roles: RolesService) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    roles.observable.subscribe(event => {
      if (event.name === 'list') this.roles = event.data;
    });

    roles.next({ name: 'refresh' });
  }

  onEvent(event: Event) {
    super.onEvent(event);
    switch (event.name) {
      case 'add':
        super.onEvent({
          name: 'modelDialog',
          data: {
            header: 'Add User',
            button: 'Add',
            model: this._modelTemplate
          }
        });
        break;
      case 'edit':
        super.onEvent({
          name: 'modelDialog',
          data: {
            header: 'Edit User: ' + event.data.name,
            button: 'Update',
            model: {
              _id: [event.data._id],
              name: [event.data.name, Validators.required],
              pwd: [''],
              enabled: [event.data.enabled],
              role: [event.data.role]
            }
          }
        });
        break;
    }
  }
}

@Component({})
@View({
  template: require('./users.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    UserDialog,
    Directives,
  ]
})
export class UsersRoute extends TableComponent {
  roles: Role[];

  constructor(
    navbar: NavbarService,
    service: UsersService,
    roles: RolesService) {
    super(service);
    navbar.active('admin/users');

    roles.observable.subscribe(event => {
      if (event.name === 'list') this.roles = event.data;
    });

    roles.next({ name: 'refresh' });
  }

  get filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x.name.indexOf(this.search.keyword) !== -1 ||
            x.enabled.toString().indexOf(this.search.keyword) !== -1 ||
            this.getRole(x.role).indexOf(this.search.keyword) !== -1;
        case 'name':
          return x.name.indexOf(this.search.keyword) !== -1;
        case 'enabled':
          return x.enabled.toString().indexOf(this.search.keyword) !== -1;
        case 'role':
          return this.getRole(x.role).indexOf(this.search.keyword) !== -1;
      }
      return false;
    };
  }

  getRole(id: string) {
    let r: any = _.find(this.roles, x => x._id === id);
    if (r) {
      r = r.name;
    } else {
      r = id;
    }
    return r;
  }
}

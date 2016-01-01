import { Component, View, ElementRef, ViewChild } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { NavbarService, UsersService, RolesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import _ = require('lodash');
import { User, Role } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({
  selector: 'dialog',
  template: require('./user.dialog.jade'),
  directives: [ Directives ]
})
class UserDialog extends ModelDialog<User> {
  roles: Role[];

  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    pwd: ['', Validators.required],
    enabled: [false],
    role: ['', Validators.required]
  };

  constructor(
    e: ElementRef,
    service: UsersService,
    fb: FormBuilder,
    roles: RolesService) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    roles.list.subscribe(
      result => {
        this.roles = result;
      }
      // TODO: Error handler
    );
  }

  showAdd() {
    this.show({
      header: 'Add User',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: User, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit User: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            pwd: [''],
            enabled: [result.enabled],
            role: [result.role, Validators.required]
          }
        });
      },
      error => { /* TODO: Error handler */ }, //this.error(error)
      () => {
        if (e) e.loading = false;
      }
    );
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
export class UsersRoute extends TableComponent<User> {
  roles: Role[];

  @ViewChild(UserDialog)
  dialog: UserDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  constructor(
    navbar: NavbarService,
    service: UsersService,
    roles: RolesService) {
    super(service);
    navbar.active('admin/users');

    roles.list.subscribe(
      result => {
        this.roles = result;
      },
      error => this.error(error)
    );

    roles.refresh();
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

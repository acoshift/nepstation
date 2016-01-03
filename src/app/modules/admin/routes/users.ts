import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import { Directives } from '../../../directives';
import _ = require('lodash');
import { UsersService } from '../services/users';
import { RolesService } from '../services/roles';
import { User } from '../models/user';
import { Role } from '../models/role';
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
    @ViewQuery('modal') e: QueryList<ElementRef>,
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

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'name': x => !!x.name && x.name.toLowerCase().includes(k),
      'enabled': x => x.enabled.toString().toLowerCase().includes(k),
      'role': x => !!x.role && this.getRole(x.role).toLowerCase().includes(k)
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

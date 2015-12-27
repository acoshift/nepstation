import { Component, View } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { NavbarService, UsersService, RolesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import _ = require('lodash');
import { User, Role } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({})
@View({
  template: require('./users.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    Directives,
  ]
})
export class UsersRoute extends TableComponent {
  header: string = '';
  model: ControlGroup;
  roles: Role[];

  constructor(
    navbar: NavbarService,
    service: UsersService,
    roles: RolesService,
    private fb: FormBuilder) {
    super(service);
    navbar.active('admin/users');

    this.model = fb.group({
      _id: [''],
      name: ['', Validators.required],
      pwd: ['', Validators.required],
      enabled: [false],
      role: ['']
    });

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

  isValid() {
    this.model.controls['name'].markAsTouched();
    this.model.controls['pwd'].markAsTouched();
    return this.model.valid;
  }

  add() {
    this.header = 'New User';

    (<Control>this.model.controls['_id']).updateValue('');
    (<Control>this.model.controls['name']).updateValue('');
    (<any>this.model.controls['name'])._touched = false;
    (<Control>this.model.controls['pwd']).validator = Validators.required;
    (<Control>this.model.controls['pwd']).updateValue('');
    (<any>this.model.controls['pwd'])._touched = false;
    (<Control>this.model.controls['enabled']).updateValue(false);
    (<Control>this.model.controls['role']).updateValue('');

    $('#userForm').modal('setting', 'onApprove', () => this.isValid()).modal('show');
  }

  edit(item: User) {
    this.header = 'Edit User: ' + item.name;

    (<Control>this.model.controls['_id']).updateValue(item._id);
    (<Control>this.model.controls['name']).updateValue(item.name);
    (<any>this.model.controls['name'])._touched = false;
    (<Control>this.model.controls['pwd']).validator = null;
    (<Control>this.model.controls['pwd']).updateValue('');
    (<any>this.model.controls['pwd'])._touched = false;
    (<Control>this.model.controls['enabled']).updateValue(item.enabled);
    (<Control>this.model.controls['role']).updateValue(item.role);

    $('#userForm').modal('setting', 'onApprove', () => this.isValid()).modal('show');
  }

  submit() {
    if (!this.model.valid) return;
    this.service.next({ name: 'submit', data: this.model.value });
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

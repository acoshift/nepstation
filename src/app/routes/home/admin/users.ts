import { Component, View } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, UsersService } from '../../../services';
import { PaginationComponent, TableComponent } from '../../../components';
import _ = require('lodash');
import moment = require('moment');
import { TimestampPipe, MomentPipe, ReversePipe, FilterPipe, RepeatPipe, PagePipe, CountPipe } from '../../../pipes';
import { User } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({})
@View({
  template: require('./users.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    Directives,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
    ReversePipe,
    FilterPipe,
    RepeatPipe,
    PagePipe,
    CountPipe,
  ]
})
export class UsersRoute extends TableComponent {
  header: string = '';
  model: ControlGroup;

  constructor(navbar: NavbarService,
              service: UsersService,
              private timestamp: TimestampPipe,
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

    service.list().subscribe(r => {
      this.page.itemCount = r && r.length || 0;
      this.loading = r === null;
    });

    service.refresh();
  }

  filter() {
    return x => {
      if (!this.search.keyword) return true;
      switch (this.search.field) {
        case '':
          return x.name.indexOf(this.search.keyword) !== -1 ||
            x.enabled.toString().indexOf(this.search.keyword) !== -1 ||
            x.role.indexOf(this.search.keyword) !== -1;
        case 'name':
          return x.name.indexOf(this.search.keyword) !== -1;
        case 'enabled':
          return x.enabled.toString().indexOf(this.search.keyword) !== -1;
        case 'role':
          return x.role.indexOf(this.search.keyword) !== -1;
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

    $('#form').modal('setting', 'onApprove', () => this.isValid()).modal('show');
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

    $('#form').modal('setting', 'onApprove', () => this.isValid()).modal('show');
  }

  submit() {
    if (!this.model.valid) return;
    console.log(this.model.value);
    this.service.submit(this.model.value).subscribe(
      r => {
        this.service.refresh();
      },
      e => {
        $('#error').modal('show');
      });
  }
}

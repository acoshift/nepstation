import { Component, View } from 'angular2/core';
import { ControlGroup, FormBuilder, Validators, Control } from 'angular2/common';
import { Subject, Subscriber } from 'rxjs';
import { NavbarService, RolesService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent } from '../../../components';
import { TimestampPipe, MomentPipe } from '../../../pipes';
import { Role } from '../../../models';
import { Directives } from '../../../directives';
declare var $: any;

@Component({})
@View({
  template: require('./roles.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    Directives,
  ],
  pipes: [
    TimestampPipe,
    MomentPipe,
  ]
})
export class RolesRoute extends TableComponent {
  header: string = '';
  model: ControlGroup;

  constructor(
    navbar: NavbarService,
    service: RolesService,
    private timestamp: TimestampPipe,
    fb: FormBuilder) {
    super(service);
    navbar.active('admin/roles');

    this.model = fb.group({
      _id: [''],
      name: ['', Validators.required],
      collections: ['', Validators.required]
    });
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

  add() {
    this.header = 'New Role';

    (<Control>this.model.controls['_id']).updateValue('');
    (<Control>this.model.controls['name']).updateValue('');

    $('#roleForm').modal('show');
  }

  edit(item: Role) {
    this.header = 'Edit Role: ' + item.name;

    (<Control>this.model.controls['_id']).updateValue(item._id);
    (<Control>this.model.controls['name']).updateValue(item.name);

    $('#roleForm').modal('show');
    // this.service.edit(item);
  }

  changeRoleAutho(role: Role, name: string, action: string, value: boolean) {
    //
  }

  submit() {
    console.log(this.model.value);
  }
}

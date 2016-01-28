import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core';
import { FormBuilder, Validators } from 'angular2/common';
import { NavbarService } from '../../../services';
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components';
import * as _ from 'lodash';
import { Directives } from '../../../directives';
import { TasksService } from '../services/tasks';
import { StaffsService } from '../services/staffs';
import { Task } from '../models/task';
import { Staff } from '../models/staff';
declare let $: any;

@Component({
  selector: 'dialog',
  template: require('./task.dialog.jade'),
  directives: [ Directives ]
})
class TaskDialog extends ModelDialog<Task> {
  private _modelTemplate = {
    _id: [''],
    code: ['', Validators.required],
    staff: [''],
    status: ['']
  };

  private staffs: Staff[];

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: TasksService,
    staffs: StaffsService,
    fb: FormBuilder) {
    super(e, service);

    this.model = fb.group(this._modelTemplate);

    staffs.list.subscribe(
      result => {
        this.staffs = result;
      }
    );
    staffs.refresh();
  }

  showAdd() {
    this.show({
      header: 'Add Task',
      button: 'Add',
      model: this._modelTemplate
    });
  }

  showEdit(item: Task, e?) {
    if (e) e.loading = true;
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Task: ' + result.code,
          button: 'Update',
          model: {
            _id: [result._id],
            code: [result.code, Validators.required],
            staff: [result.staff],
            status: [result.status]
          }
        });
      },
      error => { /* TODO: Error handler */ },
      () => {
        if (e) e.loading = false;
      }
    );
  }
}

@Component({})
@View({
  template: require('./tasks.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    TaskDialog,
    Directives,
  ]
})
export class TasksRoute extends TableComponent<Task> {
  @ViewChild(TaskDialog)
  dialog: TaskDialog;

  @ViewChild(AlertComponent)
  protected alert: AlertComponent;

  private staffs: Staff[];

  constructor(navbar: NavbarService,
              service: TasksService,
              staffs: StaffsService) {
    super(service);
    navbar.active('ems/tasks');

    staffs.list.subscribe(
      result => {
        this.staffs = result;
      }
    );
    staffs.refresh();
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase();
    return {
      'code': x => !k || !!x.code && x.code.toLowerCase().includes(k),
      'staff': x => !k || !!x.staff && this.getStaff(x.staff).toLowerCase().includes(k),
      'status': x => !k || !!x.status && x.status.toLowerCase().includes(k)
    };
  };

  getStaff(id: string): string {
    let t = _.find(this.staffs, x => x._id === id);
    return t && t.fullname || '';
  }

  status(status: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

import { Component, View, ElementRef, ViewChild, ViewQuery, QueryList } from 'angular2/core'
import { FormBuilder, Validators } from 'angular2/common'
import { NavbarService } from '../../../services'
import { PaginationComponent, TableComponent, AlertComponent, ModelDialog } from '../../../components'
import * as _ from 'lodash'
import { Directives } from '../../../directives'
import { StaffsService } from '../services/staffs'
import { Staff } from '../models/staff'
declare let $: any

@Component({
  selector: 'dialog',
  template: require('./staff.dialog.jade'),
  directives: [ Directives ]
})
class StaffDialog extends ModelDialog<Staff> {
  private _modelTemplate = {
    _id: [''],
    name: ['', Validators.required],
    pwd: [''],
    enabled: [false],
    code: ['', Validators.required],
    fullname: ['', Validators.required],
    phone: [''],
    email: [''],
    quota: [0]
  }

  constructor(
    @ViewQuery('modal') e: QueryList<ElementRef>,
    service: StaffsService,
    fb: FormBuilder) {
    super(e, service)

    this.model = fb.group(this._modelTemplate)
  }

  showAdd() {
    this.show({
      header: 'Add Staff',
      button: 'Add',
      model: this._modelTemplate
    })
  }

  showEdit(item: Staff, e?) {
    if (e) e.loading = true
    this.service.read(item._id).subscribe(
      result => {
        this.show({
          header: 'Edit Staff: ' + result.name,
          button: 'Update',
          model: {
            _id: [result._id],
            name: [result.name, Validators.required],
            pwd: [''],
            enabled: [result.enabled],
            code: [result.code, Validators.required],
            fullname: [result.fullname, Validators.required],
            phone: [result.phone],
            email: [result.email],
            quota: [result.quota]
          }
        })
      },
      error => { /* TODO: Error handler */ },
      () => {
        if (e) e.loading = false
      }
    )
  }
}

@Component({})
@View({
  template: require('./staffs.jade'),
  styles: [ ],
  directives: [
    PaginationComponent,
    AlertComponent,
    StaffDialog,
    Directives,
  ]
})
export class StaffsRoute extends TableComponent<Staff> {
  @ViewChild(StaffDialog)
  dialog: StaffDialog

  @ViewChild(AlertComponent)
  protected alert: AlertComponent

  constructor(navbar: NavbarService,
              service: StaffsService) {
    super(service)
    navbar.active('ems/staffs')
  }

  get filters(): { [ key: string ]: Function } {
    let k = this.search.keyword.toLowerCase()
    return {
      'code': x => !!x.code && x.code.toLowerCase().includes(k),
      'fullname': x => !!x.fullname && x.fullname.toLowerCase().includes(k),
      'enabled': x => x.enabled.toString().toLowerCase().includes(k),
      'phone': x => !!x.phone && x.phone.toLowerCase().includes(k),
      'email': x => !!x.email && x.email.toLowerCase().includes(k)
    }
  }
}

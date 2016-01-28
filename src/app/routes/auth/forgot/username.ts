import {
  Component,
  View,
} from 'angular2/core'

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  FORM_BINDINGS,
  ControlGroup,
  FormBuilder,
  Validators,
  Control,
  AbstractControl,
  NgClass,
} from 'angular2/common'

import {
  Router,
  RouterLink,
} from 'angular2/router'

import {
  AuthService,
} from '../../../services'

declare let $: any

@Component({})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
  ],
  template: '',
  styles: [ ],
})
export class UsernameRoute {

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {

  }

  invalidInput() {
    // TODO: show invalid input to user
  }
}

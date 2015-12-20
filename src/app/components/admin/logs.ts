import {
  Component,
  View,
} from 'angular2/core';

import {
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/common';

import {
  Router,
  RouterLink,
} from 'angular2/router';

import {
  AuthService,
} from '../../services';

declare var $: any;

@Component({})
@View({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    RouterLink,
  ],
  template: '',
  styles: [ '' ],
})
export class LogsComponent {
  loginForm: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {

  }

}

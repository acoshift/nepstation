import {
  Component,
  View,
} from 'angular2/core';

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
  template: require('./login.html'),
  styles: [ require('./login.css') ],
})
export class LoginComponent {
  loginForm: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {
    // init semantic-ui
    $('.ui.checkbox').checkbox();
    $('.modal').modal({ closable: false, allowMultiple: false });

    // init model
    this.loginForm = fb.group({
      user: ['', Validators.required],
      pwd: ['', Validators.required],
      remember: [false]
    });

    // check auth
    if (auth.isLoggedIn()) {
      router.navigate(['Home']);
      return;
    }
  }

  login() {
    if (!this.loginForm.valid) {
      $('#invalid').modal('show');
      return;
    }
    let { user, pwd, remember } = this.loginForm.value;
    $('#loading').modal('show');
    this.auth.login(user, pwd, remember, success => {
      if (success) {
        $('#loading').modal('hide');
        this.router.navigate(['/Home']);
      } else {
        $('#wrong').modal({
          onHide: () => { $('#loading').modal('hide'); }
        }).modal('show');
      }
    });
  }
}

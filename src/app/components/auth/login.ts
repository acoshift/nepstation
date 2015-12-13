import {
  Component,
  View,
  FORM_DIRECTIVES,
  CORE_DIRECTIVES,
  Inject,
  ControlGroup,
  FormBuilder,
  Validators,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

/*
import {
  Alert,
} from 'ng2-bootstrap';
*/
import {
  AuthService
} from '../../services';

@Component({ })
@View({
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
  template: require('./login.html'),
})
export class LoginComponent {
  form: ControlGroup;

  constructor(private router: Router,
              private auth: AuthService,
              fb: FormBuilder) {
    //if (!auth.check()) return;
    this.form = fb.group({
      user: ['', Validators.required],
      pwd: ['', Validators.required],
      remember: [false]
    });
  }

  login() {
    if (!this.form.valid) return this.invalidInput();
    let { user, pwd, remember } = this.form.value;
    this.auth.login(user, pwd, remember);
  }

  invalidInput() {
    // TODO: show invalid input to user
  }
}

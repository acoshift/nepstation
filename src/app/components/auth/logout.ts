import {
  Component,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

@Component({
  template: ''
})
export default class LogoutComponent {
  constructor(private router: Router) {
    console.log('logout...');
    localStorage.removeItem('token');
    router.navigate(['/Auth.Login']);
  }
}

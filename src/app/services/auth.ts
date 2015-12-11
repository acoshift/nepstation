import {
  Component,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

import { DbService } from './db';

@Component({})
export class AuthService {
  constructor(private db: DbService, private router: Router) { }

  public check() {
    if (!localStorage.getItem('token'))
      this.router.navigate(['/Auth.Login']);
    else
      this.router.navigate(['/Home']);
  }

  login(user: string, pwd: string) {
    localStorage.setItem('token', 'test-token');
    this.router.navigate(['/Home']);
    // return this.db.request('auth', 'login', {user: user, pwd: pwd}, '{token}');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/Auth.Login']);
  }
}

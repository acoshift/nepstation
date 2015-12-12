import {
  Component,
  Inject,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

import { DbService } from './db';

export interface LoginData {
  user: string;
  pwd: string;
  remember: boolean;
}

@Component({})
export class AuthService {
  constructor(@Inject(Router) private router: Router,
              @Inject(DbService) private db: DbService) { }

  public check() {
    if (!localStorage.getItem('token'))
      this.router.navigate(['/Auth.Login']);
    else
      this.router.navigate(['/Home']);
  }

  login(loginData: LoginData) {
    localStorage.setItem('token', 'test-token');
    this.router.navigate(['/Home']);
    // return this.db.request('auth', 'login', {user: user, pwd: pwd}, '{token}');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/Auth.Login']);
  }
}

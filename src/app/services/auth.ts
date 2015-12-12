import {
  Component,
  Inject,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(@Inject(Router) private router: Router,
              @Inject(DbService) private db: DbService) { }

  public check() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/Auth.Login']);
      return false;
    }
    return true;
  }

  login(loginData: LoginData) {
    this.db.request('auth', 'login', loginData, 'token')
      .subscribe(
        r => localStorage.setItem('token', r.token),
        (err) => this.loginFailed(err),
        () => this.loginCompleted());
  }

  logout() {
    this.db.request('auth', 'logout', null, null);
    localStorage.removeItem('token');
    this.router.navigate(['/Auth.Login']);
  }

  private loginFailed(err) {
    console.log('login failed!');
  }

  private loginCompleted() {
    this.router.navigate(['/Home']);
  }
}

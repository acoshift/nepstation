import {
  Component,
  Inject,
  Injectable,
} from 'angular2/angular2';

import {
  Router
} from 'angular2/router';

import { DbService } from './db';

@Injectable()
export class AuthService {
  constructor(@Inject(Router) private router: Router,
              @Inject(DbService) private db: DbService) {
    this.token = sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  private token: string;

  public check() {
    if (!this.token) {
      this.router.navigate(['/Auth.Login']);
      return false;
    }
    return true;
  }

  login(user: string, pwd: string, remember: boolean) {
    this.db.request('auth', 'login', { user: user, pwd: pwd }, 'token')
      .subscribe(
        r => this.setToken(r.token, remember),
        (err) => this.loginFailed(err),
        () => this.loginCompleted());
  }

  logout() {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    this.router.navigate(['/Auth.Login']);
  }

  private setToken(token: string, remember: boolean) {
    this.token = token;
    if (remember) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  }

  private loginFailed(err) {
    console.log('login failed!');
  }

  private loginCompleted() {
    this.router.navigate(['/Home']);
  }
}

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
    let token = this.token();
    if (localStorage.getItem('token')) this.remember = true;
    if (token) this.refresh();
  }

  private remember = false;

  private token() {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  public check() {
    if (!this.token()) {
      this.router.navigate(['/Auth.Login']);
      return false;
    }
    return true;
  }

  login(user: string, pwd: string, remember: boolean) {
    this.remember = remember;
    this.db.login({ user: user, pwd: pwd })
      .subscribe(
        r => {
          if (r.error) return this.loginFailed(r.error);
          this.setToken(r.token);
          this.router.navigate(['/Home']);
        },
        err => this.loginFailed(err));
  }

  logout() {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    this.router.navigate(['/Auth.Login']);
  }

  refresh() {
    this.db.refresh()
      .subscribe(r => this.setToken(r.token));
  }

  private setToken(token: string) {
    if (this.remember) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  }

  private loginFailed(err) {
    // TODO:
    console.log('login failed!');
  }
}

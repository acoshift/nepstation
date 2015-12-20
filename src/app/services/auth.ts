import {
  Component,
  Injectable,
} from 'angular2/core';

import {
  Router
} from 'angular2/router';

import { DbService } from './db';

@Injectable()
export class AuthService {
  private remember = false;

  constructor(private router: Router,
              private db: DbService) {
    let token = this.token();
    if (localStorage.getItem('token')) this.remember = true;
  }

  public check() {
    if (!this.token()) {
      this.router.navigate(['/Auth/Login']);
      return false;
    }
    return true;
  }

  public isLoggedIn() {
    return this.token() != null;
  }

  login(user: string, pwd: string, remember: boolean, cb: (success: boolean) => void) {
    this.remember = remember;
    this.db.login({ name: user, pwd: pwd })
      .subscribe(
        r => {
          if (r.error) return cb(false);
          this.setToken(r.token);
          cb(true);
        },
        err => cb(false));
  }

  logout() {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  }

  private setToken(token: string) {
    if (this.remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  private token() {
    return sessionStorage.getItem('token') || localStorage.getItem('token') || null;
  }
}

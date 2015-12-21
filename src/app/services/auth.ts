import {
  Component,
  Injectable,
} from 'angular2/core';

import {
  Router,
  Location,
} from 'angular2/router';

import { DbService } from './db';

@Injectable()
export class AuthService {
  remember = false;
  lastLocation = null;

  constructor(private router: Router,
              private location: Location,
              private db: DbService) {
    let token = this.token();
    if (localStorage.getItem('token')) this.remember = true;
  }

  public check() {
    if (!this.token()) {
      this.lastLocation = this.location.path();
      this.router.navigate(['/Auth/Login']);
      return false;
    }
    return true;
  }

  public isLoggedIn() {
    return this.token() != null;
  }

  login(user: string, pwd: string, remember: boolean, cb: (ok: boolean, lastLocation: string) => void) {
    this.remember = remember;
    this.db.login({ name: user, pwd: pwd })
      .subscribe(
        r => {
          if (r.error) return cb(false, null);
          this.setToken(r.token);
          cb(true, this.lastLocation);
          this.lastLocation = null;
        },
        err => cb(false, null));
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

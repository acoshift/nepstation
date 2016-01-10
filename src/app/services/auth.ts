import { Component, Injectable } from 'angular2/core';
import { Router, Location } from 'angular2/router';
import { Observable } from 'rxjs';
import { DbService } from './db';

@Injectable()
export class AuthService {
  remember = false;
  lastLocation = null;
  user: any;

  constructor(private router: Router,
              private location: Location,
              private db: DbService) {
    let token = this.token();
    if (localStorage.getItem('token')) this.remember = true;
  }

  check() {
    if (!this.token()) {
      this.lastLocation = this.location.path();
      setTimeout(() => {
        this.router.navigate(['/Auth']);
      });
      return false;
    }
    return true;
  }

  isLoggedIn() {
    return this.token() != null;
  }

  login(user: string, pwd: string, remember: boolean): Observable<{ ok: boolean, lastLocation: string }> {
    this.remember = remember;
    return Observable.create(emitter => {
      this.db.login({ name: user, pwd: pwd })
        .subscribe(
          result => {
            if (result.error) return emitter.next({ ok: false, lastLocation: null});
            this.setToken(result.token);
            this.user = result.user;
            emitter.next({ ok: true, lastLocation: this.lastLocation });
            this.lastLocation = null;
          },
          err => emitter.next({ ok: false, lastLocation: null }),
          () => emitter.complete()
        );
    });
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

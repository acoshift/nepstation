import { Component, View, ViewChild } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';
import { AlertComponent, IndicatorComponent } from '../../components';
import { Directives } from '../../directives';
import { Router, RouterLink } from 'angular2/router';
import { AuthService } from '../../services';

@Component({})
@View({
  directives: [
    FORM_DIRECTIVES,
    RouterLink,
    Directives,
    AlertComponent,
    IndicatorComponent,
  ],
  template: require('./login.jade'),
  styles: [ require('./login.css') ],
})
export class LoginRoute {
  @ViewChild(AlertComponent)
  private _alert: AlertComponent;

  @ViewChild(IndicatorComponent)
  private _indicator: IndicatorComponent;

  constructor(
    private router: Router,
    private auth: AuthService) {

    // if alredy login, redirect to home
    if (auth.isLoggedIn()) {
      router.navigate(['/Home']);
      return;
    }

    // check auth
    if (auth.isLoggedIn()) {
      router.navigate(['Home']);
      return;
    }
  }

  login(f) {
    if (!f.user || !f.pwd) {
      this._alert.show({
        title: '',
        content: 'Please input username and password.',
        buttons: [ 'ok' ]
      });
      return;
    }
    this._indicator.show();
    this.auth.login(f.user, f.pwd, f.remember).subscribe(
      ({ ok, lastLocation }) => {
        if (ok) {
          this._indicator.hide();
          if (lastLocation) {
            this.router.navigateByUrl(lastLocation);
          } else {
            this.router.navigate(['/Home']);
          }
        } else {
          this._alert.show({
            title: '',
              content: 'Wrong username or password.',
              buttons: [ 'ok' ],
              onHide: () => this._indicator.hide()
          });
        }
      }
    );
  }
}

import { Component, View } from 'angular2/core'
import { Router, RouterLink } from 'angular2/router'
import { AuthService, NavbarService } from '../services'
declare let $: any

@Component({
  selector: 'navbar'
})
@View({
  directives: [
    RouterLink
  ],
  template: require('./navbar.jade'),
  styles: [ require('./navbar.css') ]
})
export class NavbarComponent {
  activated: string = ''

  constructor (private router: Router,
              private auth: AuthService,
              private navbar: NavbarService) {
    navbar.onActive(x => this.change(x))
  }

  change (active) {
    this.activated = active
  }

  isActive (x: string) {
    return this.activated === x
  }

  logout () {
    this.auth.logout()
    this.router.navigate(['/Auth'])
  }
}

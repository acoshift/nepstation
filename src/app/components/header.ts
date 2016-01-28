import { Component, View } from 'angular2/core'

import { Router, ROUTER_DIRECTIVES } from 'angular2/router'

@Component({

})
@View({
  template: '',
})
export class HeaderComponent {
  constructor (private router: Router) { }

  logout () {
    // this.auth.logout()
  }
}

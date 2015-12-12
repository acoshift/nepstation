import {
  Component,
  View,
  Inject,
} from 'angular2/angular2';

import {
  Router,
  ROUTER_DIRECTIVES
} from 'angular2/router';


@Component({

})
@View({
  template: '',
})
export class HeaderComponent {
  constructor(@Inject(Router) private router: Router) { }

  logout() {
    // this.auth.logout();
  }
}

import {
  Component,
  View,
} from 'angular2/core';

@Component({
  selector: 'footer'
})
@View({
  template: require('./footer.html'),
  styles: [ require('./footer.css') ]
})
export class FooterComponent {
  constructor() {
    //
  }
}

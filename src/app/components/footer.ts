import {
  Component,
  View,
} from 'angular2/angular2';

@Component({
  selector: 'footer'
})
@View({
  template: 'Copyright &copy; Moon Rhythm 2015'
})
export class FooterComponent {
  constructor() { }
}

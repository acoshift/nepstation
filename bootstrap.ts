/// <reference path="node_modules/angular2/angular2.d.ts" />

import {
  bootstrap,
  provide,
  Component,
  NgModel,
  FORM_DIRECTIVES
} from 'angular2/angular2';

import {
  ROUTER_PROVIDERS,
  APP_BASE_HREF,

} from 'angular2/router';

@Component({
  selector: 'app',
  directives: [NgModel, FORM_DIRECTIVES],
  template: `<h1>Test {{name}}</h1><input type="text" [(ng-model)]="name">`
})
class App {
  public name: string;

  constructor() {
    this.name = 'my name';
  }

  change(v) {
    this.name = v;
  }
}

bootstrap(App);

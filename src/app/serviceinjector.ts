import { Injector, Injectable } from 'angular2/core';
import { Services } from './services';
import _ = require('lodash');

@Injectable()
export class ServiceInjector {
  private _services: any[] = [];

  constructor(private _injector: Injector) { }

  inject() {
    let __inject = services => {
      _.forEach(services, x => {
        if (_.isArray(x)) return __inject(x);
        this._services.push(this._injector.get(x))
      });
    };
    __inject(Services);
  }
}

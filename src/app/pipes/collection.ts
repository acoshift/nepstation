import {
  Pipe,
  PipeTransform,
} from 'angular2/core';

import _ = require('lodash');

@Pipe({ name: 'reverse', pure: false })
export class ReversePipe implements PipeTransform {
  transform(value: any[], args: string[]) {
    if (!value) return null;
    return _(value).reverse().value();
  }
}

@Pipe({ name: 'filter', pure: false })
export class FilterPipe implements PipeTransform {
  result: any[];
  args: any;

  transform(value: any[], args: any[]) {
    if (!value) return null;

    if (!args[0] || !args[1]) {
      return value;
    }

    if (this.args !== args[1]) {
      this.result = _.filter(value, x => args[0](x, args.slice(1)));
      this.args = args[1];
    }

    return this.result;
  }
}

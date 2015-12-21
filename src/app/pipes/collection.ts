import {
  Pipe,
  PipeTransform,
} from 'angular2/core';

import _ = require('lodash');

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: any[], args: string[]) {
    if (!value) return null;
    return _(value).reverse().value();
  }
}

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any[], args: Function[]) {
    if (!value) return null;
    if (!args[0]) return value;
    return _.filter(value, x => args[0](x));
  }
}

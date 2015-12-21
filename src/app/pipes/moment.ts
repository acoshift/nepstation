import {
  Pipe,
  PipeTransform,
} from 'angular2/core';

import moment = require('moment');

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
  transform(value: any, args: string[]) {
    return moment(value).format(args[0] || undefined);
  }
}

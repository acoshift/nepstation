import {
  Pipe,
  PipeTransform,
} from 'angular2/core'

import * as moment from 'moment'

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
  transform (value: any, args: string[]) {
    return moment(value).format(args[0] || undefined)
  }
}

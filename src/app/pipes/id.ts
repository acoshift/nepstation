import {
  Pipe,
  PipeTransform,
  Injectable,
} from 'angular2/core';

// MongoDB's ObjectID to Timestamp
@Pipe({ name: 'timestamp' })
@Injectable()
export class TimestampPipe implements PipeTransform {
  transform(value: string): number {
    return parseInt(value.substr(0, 8), 16) * 1000;
  }
}

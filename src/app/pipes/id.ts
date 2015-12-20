import {
  Pipe,
} from 'angular2/core';

// MongoDB's ObjectID to Timestamp
@Pipe({ name: 'timestamp' })
export class Timestamp {
  transform(value: string) {
    return parseInt(value.substr(0, 8), 16) * 1000;
  }
}

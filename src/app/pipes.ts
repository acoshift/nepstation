export * from './pipes/moment';
export * from './pipes/id';
export * from './pipes/collection';

import { MomentPipe } from './pipes/moment';
import { TimestampPipe } from './pipes/id';
import { ReversePipe, FilterPipe, RepeatPipe } from './pipes/collection';

export var Pipes = [
  MomentPipe,
  TimestampPipe,
  ReversePipe,
  RepeatPipe,
]

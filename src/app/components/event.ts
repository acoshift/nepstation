import { OnInit, Input, Output, EventEmitter } from 'angular2/core';
import { Observable } from 'rxjs';
import { Event } from '../models';

export abstract class EventComponent implements OnInit {
  @Input()
  data: any;

  @Input()
  subscribeTo: Observable<Event>;

  @Output()
  next: EventEmitter<Event> = new EventEmitter();

  ngOnInit() {
    if (this.subscribeTo) {
      this.subscribeTo.subscribe(event => this.onEvent(event));
    }
  }

  protected abstract onEvent(event: Event);
}

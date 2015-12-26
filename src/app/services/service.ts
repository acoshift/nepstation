import { Observable, Subject } from 'rxjs';
import { Event } from '../models';

export abstract class Service {
  protected emitter: Subject<Event>;
  private _observable: Observable<Event>;

  constructor() {
    this.emitter = new Subject();
    this._observable = this.emitter.share();
  }

  abstract onEvent(event: Event): void;

  subscribeTo(observable: Observable<Event>): void {
    observable.subscribe(r => this.onEvent(r));
  }

  next(event: Event): void {
    this.onEvent(event);
  }

  get observable(): Observable<Event> {
    return this._observable;
  }
}

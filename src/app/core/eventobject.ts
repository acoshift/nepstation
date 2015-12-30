import { Inject } from 'angular2/core';
import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { Event } from './event';
import { EventService } from './eventservice';

export abstract class EventObject {
  private _emitter: Subject<Event> = new Subject();
  private _published: ConnectableObservable<Event> = this._emitter.publish();

  observable: Observable<Event> = null; // inject by EventService

  subscribe = this._published.subscribe.bind(this._published);

  constructor(es: EventService, protected id: string) {
    this._published.connect();
    es.add(id, this);
  }

  emit(event: Event) {
    event.sender = this.id;
    if (!event.target) return;
    this._emitter.next(event);
  }

  response(event: Event, resp: any) {
    this._emitter.next({
      sender: this.id,
      target: event.sender,
      name: event.name,
      request: event.request,
      response: resp
    });
  }
}

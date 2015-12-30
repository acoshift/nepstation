import { Injectable } from 'angular2/core';
import { Event } from './event';
import { EventObject } from './eventobject';
import { Observable, Subject } from 'rxjs';
import _ = require('lodash');

@Injectable()
export class EventService {
  private _objs: {
    class: string;
    id: string;
    obj: EventObject;
    emitter: Subject<Event>;
  }[] = [];

  add(id: string, obj: EventObject) {
    let [ __id, ...__class ] = id.split('.');
    let emitter = new Subject();
    this._objs.push({
      class: __class.join('.'),
      id: __id,
      obj: obj,
      emitter: emitter
    });
    obj.observable = emitter.share();
    obj.subscribe(
      event => {
        this.send(event);
      },
      error => {
        // use event's name = 'error'
        // ignore
      },
      () => {
        this.remove(obj);
      }
    );
  }

  remove(obj: EventObject) {
    _.remove(this._objs, x => x.obj === obj);
  }

  send(event: Event) {
    _(this._objs)
      .filter(x => event.target === (event.target.startsWith('.') ? x.class : x.id + '.' + x.class))
      .forEach(x => x.emitter.next(event))
      .commit();
  }
}

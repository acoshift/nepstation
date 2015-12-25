import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from '../db';
import { ModelService, User } from '../../models';

@Injectable()
export class UsersService implements ModelService<User> {
  private user: Subject<User[]> = new BehaviorSubject(null);
  private users: Observable<User[]> = this.user.share();

  constructor(private db: DbService) { }

  refresh() {
    this.db.nepq('query', 'db.users', null, {
      _id: 1, name: 1, enabled: 1, role: 1
    })
    .subscribe(
      r => {
        if (r.error) return this.user.error(r.error);
        this.user.next(r);
      },
      e => { ; }//this.log.error(e)
    );
  }

  list() {
    return this.users;
  }

  read(id: string): Observable<User> {
    return this.db.nepq('query', 'db.users', id, {
      _id: 1, name: 1, enabled: 1, role: 1
    });
  }
}

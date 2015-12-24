import { Injectable } from 'angular2/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { DbService } from '../db';
import { ModelService } from '../../models/services';
import { User } from '../../models/admin';

@Injectable()
export class UsersService implements ModelService<User[]> {
  private users: Observable<User[]>;
  private user: Subject<User[]>;

  constructor(private db: DbService) {
    this.user = new BehaviorSubject(null);
    this.users = this.user.share();
  }

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

  observable() {
    return this.users;
  }
}

import {
  Component,
} from 'angular2/angular2';

import {
  Http,
} from 'angular2/http';

@Component({})
export class DbService {
  constructor(private http: Http) { }

  request(method: string, ns: string, param: any, retrieve: string) {
    console.log('request...');
    return new Promise((resolve, reject) => {
      resolve();
    });
    // prefix ns with web name
    // send request to server
  }
}

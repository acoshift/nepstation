import {
  Injectable,
} from 'angular2/core';

import {
  Http,
  Request,
  RequestMethod,
  Headers,
} from 'angular2/http';

@Injectable()
export class DbService {
  constructor(private http: Http) { }

  server = 'http://localhost:9000/';
  // server = 'http://test.farkpage.com';

  db = 'test';

  request(body: string) {
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/nepq'
    });
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) headers.append('Authorization', 'Bearer ' + token);

    return this.http.request(new Request({
      method: RequestMethod.Post,
      url: this.server,
      body: body,
      headers: headers
    })).map(x => x.json());
  }

  login(param: any) {
    return this.request(`login ${this.db}(${JSON.stringify(param)})`);
  }

  refresh() {
    return this.request(`refresh`);
  }

  private makeNepQ(method: string, ns: string, param: any, retrieve: string) {
    let p = param ? `(${JSON.stringify(param)})` : '';
    let ret = retrieve ? `{${retrieve}}` : '';
    let r = `${method}${ns}${p}${ret}`;
    console.log('make request: ' + r);
    return r;
  }
}

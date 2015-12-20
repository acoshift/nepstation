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

  server = 'https://farkpage.com/nepdb';

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

  login(params: any) {
    return this.request(`login ${this.db}(${JSON.stringify(params)})`);
  }

  nepq(method: string, ns: string, params: any, retrieve: string) {
    return this.request(this.makeNepQ(method, ns, params, retrieve));
  }

  private makeNepQ(method: string, ns: string, params: any, retrieve: string) {
    let p = params ? `(${JSON.stringify(params)})` : '';
    let ret = retrieve ? `{${retrieve}}` : '';
    let n = ns ? ` ${this.db}.${ns}` : '';
    let r = `${method}${n}${p}${ret}`;
    console.log('make request: ' + r);
    return r;
  }
}

import {
  Injectable,
  Inject,
} from 'angular2/angular2';

import {
  Http,
  Request,
  RequestMethod,
  Headers,
} from 'angular2/http';

@Injectable()
export class DbService {
  constructor(@Inject(Http) private http: Http) { }

  request(method: string, ns: string, param: any, retrieve: string) {
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/nepq'
    });
    let token = localStorage.getItem('token');
    if (token) headers.append('Authorization', token);

    return this.http.request(new Request({
      method: RequestMethod.Post,
      url: 'http://test.farkpage.com',
      body: this.makeNepQ(method, 'test', ns, param, retrieve),
      headers: headers
    })).map(x => x.json());
  }

  private makeNepQ(method: string, namespace: string, name: string, param: any, retrieve: string) {
    let ns = namespace && namespace !== '' ? `${namespace}.${name}` : name;
    let p = param ? `(${JSON.stringify(param)})` : '';
    let ret = retrieve ? `{${retrieve}}` : '';
    let r = `${method} ${ns}${p}${ret}`;
    console.log('make request: ' + r);
    return r;
  }
}

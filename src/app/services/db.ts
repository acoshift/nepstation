import {
  Component,
  Inject,
} from 'angular2/angular2';

import {
  Http,
  Request,
  RequestMethod,
  Headers,
} from 'angular2/http';

@Component({})
export class DbService {
  constructor(@Inject(Http) private http: Http) { }

  request(method: string, ns: string, param: any, retrieve: string) {
    return this.http.request(new Request({
      method: RequestMethod.Post,
      url: 'http://test.farkpage.com',
      body: this.makeRequest(method, 'test', ns, param, retrieve),
      headers: new Headers({
        'accept': 'application/json',
        'content-type': 'application/nepq',
        'token': localStorage.getItem('token')
      })
    }));
  }

  private makeRequest(method: string, namespace: string, name: string, param: any, retrieve: string) {
    let ns = namespace && namespace !== '' ? `${namespace}.${name}` : name;
    let p = param ? `(${JSON.stringify(param)})` : '';
    let ret = retrieve ? `{${retrieve}}` : '';
    return `${method} ${ns}${p}${ret}`;
  }
}

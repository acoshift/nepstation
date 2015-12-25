import {
  Injectable,
} from 'angular2/core';

import {
  Http,
  Request,
  RequestMethod,
  Headers,
} from 'angular2/http';

import { Observable } from 'rxjs';

import { CacheService } from './cache';

import _ = require('lodash');

@Injectable()
export class DbService {
  constructor(private http: Http, private cache: CacheService) { }

  server = 'https://farkpage.com/nepdb';

  db = 'test';

  request(method: string, ns?: string, params?: any, retrieves?: any, skipCache?: boolean) {
    let body = this.makeNepQ(method, ns, params, retrieves);
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/nepq'
    });
    let token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) headers.append('Authorization', 'Bearer ' + token);

    let etag = this.cache.etag(body);
    if (etag) headers.append('If-None-Match', etag);

    return this.http.request(new Request({
      method: RequestMethod.Post,
      url: this.server,
      body: body,
      headers: headers
    })).catch(err => {
      return Observable.create(observer => {
        if (err.status === 304) {
          observer.next(err);
          observer.complete();
        } else {
          observer.error(err);
        }
      });
    }).map(res => {
      if (res.status === 304) {
        return this.cache.data(body);
      }
      let r = res.json();
      if (!r.error) this.cache.cache(body, res.headers.get('etag'), r);
      return r;
    });
  }

  login(params: any) {
    return this.request('login', '', params);
  }

  retrieves(rets: any) {
    let ret = '';
    _.forOwn(rets, (v, k) => {
      if (v !== 1 && !_.isPlainObject(v)) return;
      ret += k;
      if (_.isPlainObject(v)) ret += `{${this.retrieves(v)}}`;
      ret += ',';
    });
    return ret.substr(0, ret.length - 1);
  }

  private makeNepQ(method: string, ns?: string, params?: any, retrieves?: any) {
    let p = params && `(${JSON.stringify(params)})` || '';
    let ret = retrieves && `{${this.retrieves(retrieves)}}` || '';
    let n = ns && ` ${this.db}.${ns}` || '';
    if (ns === '') n = ` ${this.db}`;
    let r = `${method}${n}${p}${ret}`;
    console.log('make request: ' + r);
    return r;
  }
}

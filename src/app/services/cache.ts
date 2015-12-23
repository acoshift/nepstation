import { Injectable } from 'angular2/core';

import _ = require('lodash');

interface Cache {
  etag: string;
  data: any;
}

@Injectable()
export class CacheService {
  _cached: { [key: string]: Cache; }[] = [];

  etag(key: string): string {
    let x = this._cached[key];
    if (x) return x.etag;
    return null;
  }

  data(key: string): string {
    let x = this._cached[key];
    if (x) return x.data;
    return null;
  }

  cache(key: string, etag: string, data: any) {
    this._cached[key] = {
      etag: etag,
      data: data
    };
  }
}

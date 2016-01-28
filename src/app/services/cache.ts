import { Injectable } from 'angular2/core'

interface Cache {
  etag: string
  data: any
  timestamp: number
}

@Injectable()
export class CacheService {
  _cached: { [key: string]: Cache }[] = []

  etag(key: string): string {
    let x = this._cached[key]
    if (x) return x.etag
    return null
  }

  data(key: string): any {
    let x = this._cached[key]
    if (x) return x.data
    return null
  }

  timestamp(key: string): number {
    let x = this._cached[key]
    if (x) return x.timestamp
    return null
  }

  cache(key: string, etag: string, data: any) {
    this._cached[key] = {
      etag: etag,
      data: data,
      timestamp: Date.now()
    }
  }

  makeFresh(key: string): void {
    if (!!this._cached[key]) {
      this._cached[key].timestamp = Date.now()
    }
  }
}

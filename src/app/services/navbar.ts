import { Injectable } from 'angular2/core'

@Injectable()
export class NavbarService {
  private _active: string = ''
  private _onActive = null

  active (x: string) {
    this._active = x
    if (this._onActive) this._onActive(x)
  }

  onActive (x: (active: string) => void) {
    this._onActive = x
  }
}

import { Id } from '../../../models'

export interface Log extends Id {
  t: {
    header: {
      typ: string
      alg: string
    }
    payload: {
      name: string
      ns: string
      iat: number
      signature: string
    }
  }
  q: {
    method: string
    name: string
    params: any
    retrieves: any
  }
}

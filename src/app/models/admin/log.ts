import { Id } from '../id';

export interface Log extends Id {
  t: {
    header: {
      typ: string;
      alg: string;
    };
    payload: {
      sub: string;
      role: string;
      iat: number;
      signature: string;
    }
  };
  q: {
    method: string;
    name: string;
    params: any;
    retrieves: any;
  };
}

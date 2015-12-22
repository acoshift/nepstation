import * as Rx from 'rxjs';

export interface ReadOnlyModelService<T> {
  refresh(): void;
  observable(): Rx.Observable<T[]>;
  data(): T[];
}

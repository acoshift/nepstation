import { Observable } from 'rxjs';

export interface ReadOnlyModelService<T> {
  refresh(): void;
  observable(): Observable<T>;
}

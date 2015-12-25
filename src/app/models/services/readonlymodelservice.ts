import { Observable } from 'rxjs';

export interface ReadOnlyModelService<T> {
  refresh(): void;
  list(): Observable<T[]>;
  read(id: string): Observable<T>;
}

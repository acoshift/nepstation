import { Observable } from 'rxjs';
import { ReadOnlyModelService } from './readonlymodelservice';

export interface ModelService<T> extends ReadOnlyModelService<T> {
  preSubmit(item: T);
  submit(item: T);
  delete(id: string);
}

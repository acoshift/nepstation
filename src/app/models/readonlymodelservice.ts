export interface ReadOnlyModelService<T> {
  refresh(): void;
  data(): any;
}

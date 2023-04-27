export interface SortingFieldMapper<T = any> {
  [key: string]: (v: T) => number | string;
}

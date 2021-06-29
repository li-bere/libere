export interface QueryConfig {
  path: string;
  field?: string;
  orderByField: string;
  limit: number;
  reverse: boolean;
  pageNumber?: number;
}

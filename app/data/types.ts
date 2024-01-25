export interface ListAllResponse<T> {
  results: T[];
  pagination: {
    page: number;
    perPage: number
    total: number;
  }
}

export interface ListAllFilterType {
  perPage?: number;
  page?: number;
}

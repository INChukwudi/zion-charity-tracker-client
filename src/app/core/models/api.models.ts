import { HttpParams } from '@angular/common/http';

export interface ApiValidationDetail {
  path: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  message: string;
  details?: ApiValidationDetail[];
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageIndex?: number;
  totalItems?: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export const toHttpParams = <T extends object>(params: T) => {
  let httpParams = new HttpParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (['string', 'number', 'boolean'].includes(typeof value)) {
      httpParams = httpParams.set(key, String(value));
    }
  }

  return httpParams;
};

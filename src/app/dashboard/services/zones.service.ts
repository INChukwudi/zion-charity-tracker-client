import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { toHttpParams } from '../../core/models/api.models';
import {
  ZoneCreatePayload,
  ZoneCreateResponse,
  ZoneListQuery,
  ZoneListResponse,
  ZoneOptionsResponse,
} from './dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: ZoneListQuery = {}): Observable<ZoneListResponse> {
    return this.http.get<ZoneListResponse>(`${this.apiBaseUrl}/zones`, {
      params: toHttpParams({ ...query }),
    });
  }

  listOptions(query: { isActive?: boolean } = {}): Observable<ZoneOptionsResponse> {
    return this.http.get<ZoneOptionsResponse>(`${this.apiBaseUrl}/zones/options`, {
      params: toHttpParams({ ...query }),
    });
  }

  create(payload: ZoneCreatePayload): Observable<ZoneCreateResponse> {
    return this.http.post<ZoneCreateResponse>(`${this.apiBaseUrl}/zones`, payload);
  }
}

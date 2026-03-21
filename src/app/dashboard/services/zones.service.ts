import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { toHttpParams } from '../../core/models/api.models';
import { ZoneListQuery, ZoneListResponse } from './dashboard.models';

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
}

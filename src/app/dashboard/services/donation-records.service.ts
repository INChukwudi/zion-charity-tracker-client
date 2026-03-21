import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { toHttpParams } from '../../core/models/api.models';
import {
  DonationRecordCreatePayload,
  DonationRecordCreateResponse,
  DonationRecordListQuery,
  DonationRecordListResponse,
} from './dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DonationRecordsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: DonationRecordListQuery = {}): Observable<DonationRecordListResponse> {
    return this.http.get<DonationRecordListResponse>(`${this.apiBaseUrl}/donation-records`, {
      params: toHttpParams({ ...query }),
    });
  }

  create(payload: DonationRecordCreatePayload): Observable<DonationRecordCreateResponse> {
    return this.http.post<DonationRecordCreateResponse>(`${this.apiBaseUrl}/donation-records`, payload);
  }
}

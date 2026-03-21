import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { toHttpParams } from '../../core/models/api.models';
import { AppointmentListQuery, AppointmentListResponse } from './dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: AppointmentListQuery = {}): Observable<AppointmentListResponse> {
    return this.http.get<AppointmentListResponse>(`${this.apiBaseUrl}/appointments`, {
      params: toHttpParams({ ...query }),
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { DashboardOverview, DashboardOverviewResponse } from './dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardOverviewService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getOverview(months = 6): Observable<DashboardOverview> {
    return this.http
      .get<DashboardOverviewResponse>(`${this.apiBaseUrl}/dashboard/overview`, {
        params: {
          months,
        },
      })
      .pipe(map(({ overview }) => overview));
  }
}

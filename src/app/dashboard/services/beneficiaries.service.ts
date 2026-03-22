import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { toHttpParams } from '../../core/models/api.models';
import { BeneficiaryDetailsResponse, BeneficiaryListQuery, BeneficiaryListResponse } from './dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class BeneficiariesService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: BeneficiaryListQuery = {}): Observable<BeneficiaryListResponse> {
    return this.http.get<BeneficiaryListResponse>(`${this.apiBaseUrl}/beneficiaries`, {
      params: toHttpParams({ ...query }),
    });
  }

  getById(beneficiaryId: number): Observable<BeneficiaryDetailsResponse> {
    return this.http.get<BeneficiaryDetailsResponse>(`${this.apiBaseUrl}/beneficiaries/${beneficiaryId}`);
  }
}

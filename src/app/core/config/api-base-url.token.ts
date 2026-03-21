import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

const normalizeApiBaseUrl = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => normalizeApiBaseUrl(environment.apiBaseUrl),
});

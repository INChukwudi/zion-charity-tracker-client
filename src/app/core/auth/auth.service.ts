import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, map, Observable, tap, timeout } from 'rxjs';
import { API_BASE_URL } from '../config/api-base-url.token';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

interface ProfileResponse {
  profile: AuthUser;
}

interface StoredSession {
  accessToken: string;
  user: AuthUser | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly sessionStorageKey = 'zct.session';
  private readonly restoreTimeoutMs = 6000;

  private readonly sessionState = signal<StoredSession>(this.readStoredSession());
  private readonly restoringState = signal(false);

  readonly user = computed(() => this.sessionState().user);
  readonly accessToken = computed(() => this.sessionState().accessToken);
  readonly isAuthenticated = computed(() => Boolean(this.sessionState().accessToken));
  readonly isRestoring = this.restoringState.asReadonly();
  readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}`.trim() : 'Account';
  });

  signIn(payload: SignInPayload, rememberMe: boolean): Observable<AuthUser> {
    return this.http.post<SignInResponse>(`${this.apiBaseUrl}/auth/signin`, payload).pipe(
      tap(({ accessToken, user }) => {
        this.persistSession({ accessToken, user }, rememberMe);
      }),
      map(({ user }) => user)
    );
  }

  async restoreSession(): Promise<void> {
    if (!this.accessToken()) {
      return;
    }

    this.restoringState.set(true);

    try {
      const { profile } = await firstValueFrom(
        this.http
          .get<ProfileResponse>(`${this.apiBaseUrl}/profile/me`)
          .pipe(timeout({ first: this.restoreTimeoutMs }))
      );

      this.sessionState.update((current) => ({
        ...current,
        user: profile,
      }));
      this.writeStoredSession(this.sessionState());
    } catch {
      this.clearSession();
    } finally {
      this.restoringState.set(false);
    }
  }

  logout(redirectToSignin = true) {
    this.clearSession();

    if (redirectToSignin) {
      void this.router.navigate(['/sign-in']);
    }
  }

  private persistSession(session: StoredSession, rememberMe: boolean) {
    this.sessionState.set(session);
    this.writeStoredSession(session, rememberMe);
  }

  private clearSession() {
    this.sessionState.set({ accessToken: '', user: null });
    localStorage.removeItem(this.sessionStorageKey);
    sessionStorage.removeItem(this.sessionStorageKey);
  }

  private readStoredSession(): StoredSession {
    const rawSession = sessionStorage.getItem(this.sessionStorageKey) || localStorage.getItem(this.sessionStorageKey);

    if (!rawSession) {
      return { accessToken: '', user: null };
    }

    try {
      const parsed = JSON.parse(rawSession) as StoredSession;
      return {
        accessToken: parsed.accessToken || '',
        user: parsed.user || null,
      };
    } catch {
      localStorage.removeItem(this.sessionStorageKey);
      sessionStorage.removeItem(this.sessionStorageKey);
      return { accessToken: '', user: null };
    }
  }

  private writeStoredSession(session: StoredSession, rememberMe = Boolean(localStorage.getItem(this.sessionStorageKey))) {
    localStorage.removeItem(this.sessionStorageKey);
    sessionStorage.removeItem(this.sessionStorageKey);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.sessionStorageKey, JSON.stringify(session));
  }
}

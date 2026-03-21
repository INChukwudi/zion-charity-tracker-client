import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, guestGuard } from './auth.guard';

describe('auth guards', () => {
  let router: Router;
  const authState = {
    accessToken: '',
    user: null as { id: number } | null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            accessToken: () => authState.accessToken,
            user: () => authState.user,
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('authGuard redirects unauthenticated users to sign-in', () => {
    authState.accessToken = '';
    authState.user = null;

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, []));

    expect(String(result)).toBe(router.createUrlTree(['/sign-in']).toString());
  });

  it('authGuard allows users with an active session', () => {
    authState.accessToken = 'token';
    authState.user = { id: 1 };

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, []));

    expect(result).toBeTrue();
  });

  it('guestGuard allows users without an active session', () => {
    authState.accessToken = '';
    authState.user = null;

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

    expect(result).toBeTrue();
  });

  it('guestGuard redirects active sessions to dashboard', () => {
    authState.accessToken = 'token';
    authState.user = { id: 1 };

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

    expect(String(result)).toBe(router.createUrlTree(['/dashboard']).toString());
  });
});

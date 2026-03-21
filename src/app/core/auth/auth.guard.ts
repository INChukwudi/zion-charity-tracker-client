import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const hasActiveSession = (authService: AuthService) =>
  Boolean(authService.accessToken() && authService.user());

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return hasActiveSession(authService) ? true : router.createUrlTree(['/sign-in']);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return hasActiveSession(authService) ? router.createUrlTree(['/dashboard']) : true;
};

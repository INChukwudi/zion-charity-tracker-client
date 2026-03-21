import { Routes } from '@angular/router';
import { guestGuard } from '../core/auth/auth.guard';
import { SignInComponent } from './sign-in/sign-in.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  {
    path: 'sign-in',
    canActivate: [guestGuard],
    component: SignInComponent,
    title: 'Sign In | Zion Charity Tracking System'
  }
];

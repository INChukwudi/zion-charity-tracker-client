import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(r => r.routes),
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },

];

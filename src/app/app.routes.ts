import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(r => r.routes),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },

];

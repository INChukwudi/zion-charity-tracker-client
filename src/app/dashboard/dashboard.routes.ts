import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { IndexComponent } from './index/index.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ZonesComponent } from './zones/zones.component';

export const dashboardRoutes : Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
        title: 'Dashboard | Zion Charity Tracking System'
      },
      {
        path: 'zones',
        component: ZonesComponent,
        title: 'Zones | Zion Charity Tracking System',
        pathMatch: 'full',
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        title: 'Appointments | Zion Charity Tracking System'
      },
      {
        path: 'create-appointment',
        component: CreateAppointmentComponent,
        title: 'Create Appointment Schedule | Zion Charity Tracking System'
      }
    ]
  }
]

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { IndexComponent } from './index/index.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CreateDonationRecordComponent } from './create-donation-record/create-donation-record.component';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { BeneficiaryDetailsComponent } from './beneficiaries/beneficiary-details.component';
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
        path: 'beneficiaries',
        component: BeneficiariesComponent,
        title: 'Beneficiaries | Zion Charity Tracking System',
        pathMatch: 'full',
      },
      {
        path: 'beneficiaries/:beneficiaryId',
        component: BeneficiaryDetailsComponent,
        title: 'Beneficiary Details | Zion Charity Tracking System',
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
        path: 'create-donation-record',
        component: CreateDonationRecordComponent,
        title: 'Create Donation Record | Zion Charity Tracking System'
      }
    ]
  }
]

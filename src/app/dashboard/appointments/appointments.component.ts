import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiErrorResponse } from '../../core/models/api.models';
import { AppointmentsService } from '../services/appointments.service';
import { DonationRecordsService } from '../services/donation-records.service';
import { Appointment, DonationRecord } from '../services/dashboard.models';

@Component({
  selector: 'app-appointments',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    NgClass,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
  private readonly donationRecordsService = inject(DonationRecordsService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly donationRecords = signal<DonationRecord[]>([]);
  protected readonly followUpAppointments = signal<Appointment[]>([]);
  protected readonly totalDonationRecords = signal(0);
  protected readonly totalAppointments = signal(0);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadDashboardData();
  }

  protected donationOwner(record: DonationRecord) {
    return `${record.firstName} ${record.lastName}`.trim();
  }

  protected appointmentBadgeClass(status: Appointment['status']) {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      case 'no-show':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  }

  private loadDashboardData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      donationRecords: this.donationRecordsService.list({ page: 1, pageSize: 12 }),
      appointments: this.appointmentsService.list({ page: 1, pageSize: 8, upcomingOnly: true }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ donationRecords, appointments }) => {
          this.donationRecords.set(donationRecords.items);
          this.followUpAppointments.set(appointments.items);
          this.totalDonationRecords.set(donationRecords.total);
          this.totalAppointments.set(appointments.total);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error));
          this.isLoading.set(false);
        },
      });
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && error.error) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || 'Unable to load donations right now.';
    }

    return 'Unable to load donations right now.';
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiErrorResponse } from '../../core/models/api.models';
import { DonationRecordCreatePayload, Zone } from '../services/dashboard.models';
import { DonationRecordsService } from '../services/donation-records.service';
import { ZonesService } from '../services/zones.service';

@Component({
  selector: 'app-create-donation-record',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './create-donation-record.component.html',
  styleUrl: './create-donation-record.component.scss'
})
export class CreateDonationRecordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly donationRecordsService = inject(DonationRecordsService);
  private readonly zonesService = inject(ZonesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly zones = signal<Zone[]>([]);
  protected readonly isLoadingZones = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly donationRecordForm = this.formBuilder.group({
    mode: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phoneNumber: ['', [Validators.required, Validators.minLength(7)]],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    streetAddress: ['', Validators.required],
    postalCode: [''],
    country: ['', Validators.required],
    state: ['', Validators.required],
    zoneId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    donationCategory: ['', Validators.required],
    followUpRequired: [false],
    notes: [''],
  });

  constructor() {
    this.loadZones();
  }

  protected submit() {
    if (this.donationRecordForm.invalid) {
      this.donationRecordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = this.toPayload();

    this.donationRecordsService
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async () => {
          this.isSubmitting.set(false);
          await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Donation record created successfully.',
          });
          await this.router.navigate(['/dashboard/appointments']);
        },
        error: async (error: unknown) => {
          this.isSubmitting.set(false);
          this.applyApiErrors(error);
          await Swal.fire({
            icon: 'error',
            title: 'Unable to save donation record',
            text: this.errorMessage() || 'Please review the form and try again.',
          });
        },
      });
  }

  protected showError(controlName: keyof typeof this.donationRecordForm.controls) {
    const control = this.donationRecordForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private loadZones() {
    this.isLoadingZones.set(true);

    this.zonesService
      .list({ page: 1, pageSize: 100, isActive: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.zones.set(response.items);
          this.isLoadingZones.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error));
          this.isLoadingZones.set(false);
        },
      });
  }

  private toPayload(): DonationRecordCreatePayload {
    const rawValue = this.donationRecordForm.getRawValue();

    return {
      mode: rawValue.mode || '',
      firstName: rawValue.firstName || '',
      lastName: rawValue.lastName || '',
      email: rawValue.email || null,
      phoneNumber: rawValue.phoneNumber || '',
      gender: (rawValue.gender || 'female') as DonationRecordCreatePayload['gender'],
      dateOfBirth: rawValue.dateOfBirth || '',
      streetAddress: rawValue.streetAddress || '',
      postalCode: rawValue.postalCode || null,
      country: rawValue.country || '',
      state: rawValue.state || '',
      zoneId: Number(rawValue.zoneId || 0),
      amount: Number(rawValue.amount || 0),
      donationCategory: rawValue.donationCategory || '',
      followUpRequired: Boolean(rawValue.followUpRequired),
      notes: rawValue.notes || null,
    };
  }

  private applyApiErrors(error: unknown) {
    this.errorMessage.set(this.getErrorMessage(error));

    if (!(error instanceof HttpErrorResponse) || !error.error) {
      return;
    }

    const apiError = error.error as ApiErrorResponse;
    for (const detail of apiError.details || []) {
      const controlName = detail.path.replace('body.', '') as keyof typeof this.donationRecordForm.controls;
      const control = this.donationRecordForm.controls[controlName];
      if (!control) {
        continue;
      }

      control.setErrors({
        ...(control.errors || {}),
        server: detail.message,
      });
      control.markAsTouched();
    }
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && error.error) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || 'Unable to save donation record right now.';
    }

    return 'Unable to save donation record right now.';
  }
}

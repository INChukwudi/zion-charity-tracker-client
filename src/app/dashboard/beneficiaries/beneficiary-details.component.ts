import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ApiErrorResponse } from '../../core/models/api.models';
import { Appointment, BeneficiaryDetailsResponse, DonationRecord } from '../services/dashboard.models';
import { BeneficiariesService } from '../services/beneficiaries.service';

interface BeneficiaryDetailsState {
  data: BeneficiaryDetailsResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
}

@Component({
  selector: 'app-beneficiary-details',
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './beneficiary-details.component.html',
  styleUrl: './beneficiary-details.component.scss'
})
export class BeneficiaryDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly beneficiariesService = inject(BeneficiariesService);

  private readonly detailsState = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('beneficiaryId') || 0)),
      switchMap((beneficiaryId) => {
        if (!Number.isInteger(beneficiaryId) || beneficiaryId <= 0) {
          return of<BeneficiaryDetailsState>({
            data: null,
            isLoading: false,
            errorMessage: 'Beneficiary was not found.',
          });
        }

        return this.beneficiariesService.getById(beneficiaryId).pipe(
          map((data) => ({ data, isLoading: false, errorMessage: null })),
          startWith({ data: null, isLoading: true, errorMessage: null }),
          catchError((error: unknown) =>
            of({
              data: null,
              isLoading: false,
              errorMessage: this.getErrorMessage(error),
            })
          )
        );
      })
    ),
    {
      initialValue: {
        data: null,
        isLoading: true,
        errorMessage: null,
      },
    }
  );

  protected readonly data = computed(() => this.detailsState().data);
  protected readonly isLoading = computed(() => this.detailsState().isLoading);
  protected readonly errorMessage = computed(() => this.detailsState().errorMessage);
  protected readonly beneficiary = computed(() => this.data()?.beneficiary ?? null);
  protected readonly summary = computed(() => this.data()?.summary ?? null);
  protected readonly donationRecords = computed(() => this.data()?.donationRecords ?? []);
  protected readonly appointments = computed(() => this.data()?.appointments ?? []);

  protected trackDonationRecord(_index: number, donationRecord: DonationRecord) {
    return donationRecord.id;
  }

  protected trackAppointment(_index: number, appointment: Appointment) {
    return appointment.id;
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && error.error) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || 'Unable to load beneficiary details right now.';
    }

    return 'Unable to load beneficiary details right now.';
  }
}


import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../../core/models/api.models';
import { Zone } from '../services/dashboard.models';
import { ZonesService } from '../services/zones.service';

@Component({
  selector: 'app-beneficiaries',
  imports: [
    FormsModule,
  ],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss'
})
export class BeneficiariesComponent {
  private readonly zonesService = inject(ZonesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly beneficiaries = signal<Zone[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly totalBeneficiaries= signal(0);
  protected searchTerm = '';

  constructor() {
    this.loadBeneficiaries();
  }

  protected searchBeneficiaries() {
    this.loadBeneficiaries(this.searchTerm);
  }

  protected clearSearch() {
    this.searchTerm = '';
    this.loadBeneficiaries();
  }

  private loadBeneficiaries(search?: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.zonesService
      .list({ page: 1, pageSize: 24, search })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.beneficiaries.set(response.items);
          this.totalBeneficiaries.set(response.total);
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
      return apiError.message || 'Unable to load beneficiaries right now.';
    }

    return 'Unable to load beneficiaries right now.';
  }
}

import { CurrencyPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { ApiErrorResponse } from '../../core/models/api.models';
import { DashboardOverviewService } from '../services/dashboard-overview.service';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

interface DashboardState {
  overview: {
    totalDonationAmount: number;
    totalBeneficiaries: number;
    totalFollowUpVisits: number;
    activeZones: number;
    monthlyDonationLabels: string[];
    monthlyDonationData: number[];
    donationCategoryLabels: string[];
    donationCategoryData: number[];
  };
  isLoading: boolean;
  errorMessage: string | null;
}

const emptyOverview: DashboardState['overview'] = {
  totalDonationAmount: 0,
  totalBeneficiaries: 0,
  totalFollowUpVisits: 0,
  activeZones: 0,
  monthlyDonationLabels: [],
  monthlyDonationData: [],
  donationCategoryLabels: [],
  donationCategoryData: [],
};

@Component({
  selector: 'app-index',
  imports: [
    RouterLink,
    BarChartComponent,
    PieChartComponent,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  private readonly dashboardOverviewService = inject(DashboardOverviewService);

  private readonly dashboardState = toSignal(
    this.dashboardOverviewService.getOverview().pipe(
      map((overview) => ({
        overview,
        isLoading: false,
        errorMessage: null,
      })),
      startWith({
        overview: emptyOverview,
        isLoading: true,
        errorMessage: null,
      }),
      catchError((error: unknown) =>
        of({
          overview: emptyOverview,
          isLoading: false,
          errorMessage: this.getErrorMessage(error),
        })
      )
    ),
    {
      initialValue: {
        overview: emptyOverview,
        isLoading: true,
        errorMessage: null,
      },
    }
  );

  protected readonly overview = computed(() => this.dashboardState().overview);
  protected readonly isLoading = computed(() => this.dashboardState().isLoading);
  protected readonly errorMessage = computed(() => this.dashboardState().errorMessage);
  protected readonly amount = computed(() => this.overview().totalDonationAmount);
  protected readonly monthlyDonationLabels = computed(() => this.overview().monthlyDonationLabels);
  protected readonly monthlyDonationData = computed(() => this.overview().monthlyDonationData);
  protected readonly donationCategoryLabels = computed(() => this.overview().donationCategoryLabels);
  protected readonly donationCategoryData = computed(() => this.overview().donationCategoryData);

  showAmount = false;

  get maskedAmount(): string {
    const totalAmount = this.amount();
    return totalAmount > 0 ? '*'.repeat(totalAmount.toFixed(0).length) : '₦0';
  }

  toggleAmount() {
    this.showAmount = !this.showAmount;
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && error.error) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || 'Unable to load dashboard insights right now.';
    }

    return 'Unable to load dashboard insights right now.';
  }
}

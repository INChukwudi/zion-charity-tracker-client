import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorResponse } from '../../core/models/api.models';
import { BeneficiaryListItem } from '../services/dashboard.models';
import { BeneficiariesService } from '../services/beneficiaries.service';

@Component({
  selector: 'app-beneficiaries',
  imports: [CommonModule, FormsModule, RouterLink, NgbPaginationModule],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss'
})
export class BeneficiariesComponent {
  private readonly beneficiariesService = inject(BeneficiariesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly beneficiaries = signal<BeneficiaryListItem[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly totalBeneficiaries = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalPages = signal(0);
  protected readonly pageSizeOptions = [10, 20, 50];
  protected searchTerm = '';

  protected readonly currentPage = computed(() => this.pageIndex() + 1);
  protected readonly startItem = computed(() => {
    if (this.totalBeneficiaries() === 0) {
      return 0;
    }

    return this.pageIndex() * this.pageSize() + 1;
  });
  protected readonly endItem = computed(() => {
    if (this.totalBeneficiaries() === 0) {
      return 0;
    }

    return Math.min(this.totalBeneficiaries(), this.pageIndex() * this.pageSize() + this.beneficiaries().length);
  });

  constructor() {
    this.loadBeneficiaries();
  }

  protected searchBeneficiaries() {
    this.pageIndex.set(0);
    this.loadBeneficiaries();
  }

  protected clearFilters() {
    this.searchTerm = '';
    this.pageIndex.set(0);
    this.loadBeneficiaries();
  }

  protected changePage(page: number) {
    const nextPageIndex = Math.max(page - 1, 0);
    if (nextPageIndex === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(nextPageIndex);
    this.loadBeneficiaries();
  }

  protected changePageSize(pageSize: string | number) {
    const normalizedPageSize = Number(pageSize);
    if (Number.isNaN(normalizedPageSize) || normalizedPageSize <= 0 || normalizedPageSize === this.pageSize()) {
      return;
    }

    this.pageSize.set(normalizedPageSize);
    this.pageIndex.set(0);
    this.loadBeneficiaries();
  }

  protected trackBeneficiary(_index: number, beneficiary: BeneficiaryListItem) {
    return beneficiary.id;
  }

  private loadBeneficiaries() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const search = this.searchTerm.trim();

    this.beneficiariesService
      .list({
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
        search: search || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.beneficiaries.set(response.items);
          this.totalBeneficiaries.set(response.totalItems ?? response.total);
          this.totalPages.set(
            response.totalPages ??
              (response.total > 0 ? Math.ceil(response.total / this.pageSize()) : 0)
          );
          this.pageIndex.set(response.pageIndex ?? Math.max(response.page - 1, 0));
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

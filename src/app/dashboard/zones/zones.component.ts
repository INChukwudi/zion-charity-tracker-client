import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { COUNTRIES } from '../../core/config/countries';
import { ApiErrorResponse } from '../../core/models/api.models';
import { Zone } from '../services/dashboard.models';
import { ZonesService } from '../services/zones.service';

@Component({
  selector: 'app-zones',
  imports: [DatePipe, FormsModule, ReactiveFormsModule, NgbPaginationModule],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.scss'
})
export class ZonesComponent {
  private readonly zonesService = inject(ZonesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly zones = signal<Zone[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly totalZones = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalPages = signal(0);
  protected readonly pageSizeOptions = [10, 20, 50];
  protected readonly countryOptions = COUNTRIES;
  protected readonly isCreateFormOpen = signal(false);
  protected readonly isSubmittingCreate = signal(false);
  protected readonly createErrorMessage = signal<string | null>(null);
  protected readonly createSuccessMessage = signal<string | null>(null);
  protected readonly createZoneForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    country: ['', Validators.required],
  });
  protected searchTerm = '';

  protected readonly currentPage = computed(() => this.pageIndex() + 1);
  protected readonly startItem = computed(() => {
    if (this.totalZones() === 0) {
      return 0;
    }

    return this.pageIndex() * this.pageSize() + 1;
  });
  protected readonly endItem = computed(() => {
    if (this.totalZones() === 0) {
      return 0;
    }

    return Math.min(this.totalZones(), this.pageIndex() * this.pageSize() + this.zones().length);
  });

  constructor() {
    this.loadZones();
  }

  protected toggleCreateForm() {
    const nextState = !this.isCreateFormOpen();
    this.isCreateFormOpen.set(nextState);
    this.createErrorMessage.set(null);

    if (!nextState) {
      this.resetCreateForm();
    }
  }

  protected cancelCreateZone() {
    this.isCreateFormOpen.set(false);
    this.createErrorMessage.set(null);
    this.resetCreateForm();
  }

  protected submitCreateZone() {
    if (this.createZoneForm.invalid) {
      this.createZoneForm.markAllAsTouched();
      return;
    }

    this.isSubmittingCreate.set(true);
    this.createErrorMessage.set(null);
    this.createSuccessMessage.set(null);

    this.zonesService
      .create(this.createZoneForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ message, zone }) => {
          this.createSuccessMessage.set(message || `Zone ${zone.name} was created successfully.`);
          this.isSubmittingCreate.set(false);
          this.isCreateFormOpen.set(false);
          this.resetCreateForm();
          this.searchTerm = zone.name;
          this.pageIndex.set(0);
          this.loadZones();
        },
        error: (error: unknown) => {
          this.createErrorMessage.set(this.getErrorMessage(error, 'Unable to create zone right now.'));
          this.isSubmittingCreate.set(false);
        },
      });
  }

  protected searchZones() {
    this.pageIndex.set(0);
    this.loadZones();
  }

  protected clearFilters() {
    this.searchTerm = '';
    this.pageIndex.set(0);
    this.loadZones();
  }

  protected changePage(page: number) {
    const nextPageIndex = Math.max(page - 1, 0);
    if (nextPageIndex === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(nextPageIndex);
    this.loadZones();
  }

  protected changePageSize(pageSize: string | number) {
    const normalizedPageSize = Number(pageSize);
    if (Number.isNaN(normalizedPageSize) || normalizedPageSize <= 0 || normalizedPageSize === this.pageSize()) {
      return;
    }

    this.pageSize.set(normalizedPageSize);
    this.pageIndex.set(0);
    this.loadZones();
  }

  protected trackZone(_index: number, zone: Zone) {
    return zone.id;
  }

  private resetCreateForm() {
    this.createZoneForm.reset({
      name: '',
      country: '',
    });
    this.createZoneForm.markAsPristine();
    this.createZoneForm.markAsUntouched();
  }

  private loadZones() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const search = this.searchTerm.trim();

    this.zonesService
      .list({
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
        search: search || undefined,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.zones.set(response.items);
          this.totalZones.set(response.totalItems ?? response.total);
          this.totalPages.set(
            response.totalPages ??
              (response.total > 0 ? Math.ceil(response.total / this.pageSize()) : 0)
          );
          this.pageIndex.set(response.pageIndex ?? Math.max(response.page - 1, 0));
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error, 'Unable to load zones right now.'));
          this.isLoading.set(false);
        },
      });
  }

  private getErrorMessage(error: unknown, fallbackMessage: string) {
    if (error instanceof HttpErrorResponse && error.error) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || fallbackMessage;
    }

    return fallbackMessage;
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardOverviewService } from '../services/dashboard-overview.service';

import { IndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [
        provideRouter([]),
        {
          provide: DashboardOverviewService,
          useValue: {
            getOverview: () =>
              of({
                totalDonationAmount: 100000,
                totalBeneficiaries: 4,
                totalFollowUpVisits: 2,
                activeZones: 3,
                monthlyDonationLabels: ['Jan', 'Feb'],
                monthlyDonationData: [10000, 90000],
                donationCategoryLabels: ['Housing Support', 'Gift'],
                donationCategoryData: [80000, 20000],
              }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

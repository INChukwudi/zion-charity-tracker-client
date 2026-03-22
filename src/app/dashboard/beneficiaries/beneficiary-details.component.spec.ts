import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BeneficiaryDetailsComponent } from './beneficiary-details.component';
import { BeneficiariesService } from '../services/beneficiaries.service';
import { ActivatedRoute } from '@angular/router';

describe('BeneficiaryDetailsComponent', () => {
  let component: BeneficiaryDetailsComponent;
  let fixture: ComponentFixture<BeneficiaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ beneficiaryId: '1' })),
          },
        },
        {
          provide: BeneficiariesService,
          useValue: {
            getById: () =>
              of({
                beneficiary: {
                  id: 1,
                  firstName: 'John',
                  lastName: 'Doe',
                  fullName: 'John Doe',
                  email: 'john@example.com',
                  phoneNumber: '08000000000',
                  gender: 'male',
                  dateOfBirth: '1990-01-01',
                  streetAddress: 'Test Address',
                  postalCode: '100001',
                  country: 'Nigeria',
                  state: 'Lagos',
                  zoneId: 1,
                  zoneName: 'Lagos Mainland',
                  createdByUserId: 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                summary: {
                  totalDonated: 5000,
                  donationRecordCount: 1,
                  appointmentCount: 1,
                  lastDonationAt: new Date().toISOString(),
                },
                donationRecords: [],
                appointments: [],
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficiaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render beneficiary full name', () => {
    expect(fixture.nativeElement.textContent).toContain('John Doe');
  });
});


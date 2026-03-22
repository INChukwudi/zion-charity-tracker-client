import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { CreateDonationRecordComponent } from './create-donation-record.component';
import { DonationRecordsService } from '../services/donation-records.service';
import { ZonesService } from '../services/zones.service';

describe('CreateDonationRecordComponent', () => {
  let component: CreateDonationRecordComponent;
  let fixture: ComponentFixture<CreateDonationRecordComponent>;
  let donationRecordsService: jasmine.SpyObj<DonationRecordsService>;

  beforeEach(async () => {
    donationRecordsService = jasmine.createSpyObj<DonationRecordsService>('DonationRecordsService', ['create', 'list']);
    donationRecordsService.create.and.returnValue(
      of({
        message: 'Beneficiary and donation record created successfully.',
        beneficiary: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: '08000000000',
          gender: 'male',
          dateOfBirth: '1990-01-01',
          streetAddress: 'Test Address',
          postalCode: '100001',
          country: 'Nigeria',
          state: 'Lagos',
          zoneId: 1,
          createdByUserId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        donationRecord: {
          id: 1,
          beneficiaryId: 1,
          mode: 'Program',
          firstName: 'John',
          lastName: 'Doe',
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
          amount: 5000,
          donationCategory: 'Gift',
          followUpRequired: true,
          followUpCount: 0,
          notes: 'Test note',
          createdByUserId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );

    spyOn(Swal, 'fire').and.resolveTo({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true,
    } as never);

    await TestBed.configureTestingModule({
      imports: [CreateDonationRecordComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: DonationRecordsService,
          useValue: donationRecordsService,
        },
        {
          provide: ZonesService,
          useValue: {
            listOptions: () =>
              of({
                items: [
                  {
                    id: 1,
                    name: 'Lagos Mainland',
                    country: 'Nigeria',
                    isActive: true,
                  },
                ],
              }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDonationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render zone options as zone name and country', () => {
    const zoneSelect: HTMLSelectElement = fixture.nativeElement.querySelector('#zoneId');
    const optionLabels = Array.from(zoneSelect.options).map((option) => option.textContent?.trim());

    expect(optionLabels).toContain('Lagos Mainland, Nigeria');
  });

  it('should submit beneficiary and donation record sections', () => {
    component['donationRecordForm'].setValue({
      mode: 'Program',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '08000000000',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      streetAddress: 'Test Address',
      postalCode: '100001',
      country: 'Nigeria',
      state: 'Lagos',
      zoneId: 1,
      amount: 5000,
      donationCategory: 'Gift',
      followUpRequired: true,
      notes: 'Test note',
    });

    component['submit']();

    expect(donationRecordsService.create).toHaveBeenCalledWith({
      beneficiary: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '08000000000',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        streetAddress: 'Test Address',
        postalCode: '100001',
        country: 'Nigeria',
        state: 'Lagos',
        zoneId: 1,
      },
      donationRecord: {
        mode: 'Program',
        amount: 5000,
        donationCategory: 'Gift',
        followUpRequired: true,
        notes: 'Test note',
      },
    });
  });
});

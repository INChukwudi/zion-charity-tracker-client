import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ZonesComponent } from './zones.component';
import { ZonesService } from '../services/zones.service';

describe('ZonesComponent', () => {
  let component: ZonesComponent;
  let fixture: ComponentFixture<ZonesComponent>;
  let zonesService: jasmine.SpyObj<ZonesService>;

  beforeEach(async () => {
    zonesService = jasmine.createSpyObj<ZonesService>('ZonesService', ['list', 'create']);
    zonesService.list.and.returnValues(
      of({
        items: [],
        pageIndex: 0,
        page: 1,
        pageSize: 10,
        total: 0,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }),
      of({
        items: [
          {
            id: 1,
            name: 'Lagos Mainland',
            country: 'Nigeria',
            state: 'Not specified',
            city: null,
            notes: null,
            isActive: true,
            createdByUserId: 1,
            donationRecordCount: 0,
            appointmentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        pageIndex: 0,
        page: 1,
        pageSize: 10,
        total: 1,
        totalItems: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      })
    );
    zonesService.create.and.returnValue(
      of({
        message: 'Zone created successfully.',
        zone: {
          id: 1,
          name: 'Lagos Mainland',
          country: 'Nigeria',
          state: 'Not specified',
          city: null,
          notes: null,
          isActive: true,
          createdByUserId: 1,
          donationRecordCount: 0,
          appointmentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );

    await TestBed.configureTestingModule({
      imports: [ZonesComponent],
      providers: [
        {
          provide: ZonesService,
          useValue: zonesService,
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the add-zone form with country options', () => {
    const toggleButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn.btn-primary');
    toggleButton.click();
    fixture.detectChanges();

    const countrySelect: HTMLSelectElement = fixture.nativeElement.querySelector('#zone-country');
    const countryOptions = Array.from(countrySelect.options).map((option) => option.textContent?.trim());

    expect(countryOptions).toContain('Nigeria');
    expect(countryOptions).toContain('United States');
  });

  it('should create a zone and reload the list', () => {
    const toggleButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.btn.btn-primary');
    toggleButton.click();
    fixture.detectChanges();

    component['createZoneForm'].setValue({
      name: 'Lagos Mainland',
      country: 'Nigeria',
    });

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    formDebugElement.triggerEventHandler('ngSubmit');
    fixture.detectChanges();

    expect(zonesService.create).toHaveBeenCalledWith({
      name: 'Lagos Mainland',
      country: 'Nigeria',
    });
    expect(zonesService.list).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Zone created successfully.');
  });
});

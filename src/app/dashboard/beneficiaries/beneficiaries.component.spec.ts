import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BeneficiariesComponent } from './beneficiaries.component';
import { BeneficiariesService } from '../services/beneficiaries.service';

describe('BeneficiariesComponent', () => {
  let component: BeneficiariesComponent;
  let fixture: ComponentFixture<BeneficiariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiariesComponent],
      providers: [
        provideRouter([]),
        {
          provide: BeneficiariesService,
          useValue: {
            list: () =>
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
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

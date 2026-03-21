import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CreateDonationRecordComponent } from './create-donation-record.component';

describe('CreateDonationRecordComponent', () => {
  let component: CreateDonationRecordComponent;
  let fixture: ComponentFixture<CreateDonationRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDonationRecordComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDonationRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

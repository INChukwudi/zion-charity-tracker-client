import { PaginatedResponse } from '../../core/models/api.models';

export interface Zone {
  id: number;
  name: string;
  country: string;
  state: string;
  city: string | null;
  notes: string | null;
  isActive: boolean;
  createdByUserId: number | null;
  donationRecordCount: number;
  appointmentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  zoneId: number;
  zoneName: string;
  donationRecordId: number | null;
  beneficiaryName: string | null;
  scheduledFor: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  contactMethod: 'phone' | 'in-person' | 'virtual' | 'home-visit';
  notes: string | null;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationRecord {
  id: number;
  mode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  streetAddress: string;
  postalCode: string | null;
  country: string;
  state: string;
  zoneId: number;
  zoneName: string;
  amount: number;
  donationCategory: string;
  followUpRequired: boolean;
  followUpCount: number;
  notes: string | null;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  totalDonationAmount: number;
  totalBeneficiaries: number;
  totalFollowUpVisits: number;
  activeZones: number;
  monthlyDonationLabels: string[];
  monthlyDonationData: number[];
  donationCategoryLabels: string[];
  donationCategoryData: number[];
}

export interface DashboardOverviewResponse {
  overview: DashboardOverview;
}

export interface DonationRecordCreatePayload {
  mode: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  streetAddress: string;
  postalCode?: string | null;
  country: string;
  state: string;
  zoneId: number;
  amount: number;
  donationCategory: string;
  followUpRequired: boolean;
  notes?: string | null;
}

export interface DonationRecordCreateResponse {
  message: string;
  donationRecord: DonationRecord;
}

export interface ZoneListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  country?: string;
  state?: string;
  isActive?: boolean;
}

export interface AppointmentListQuery {
  page?: number;
  pageSize?: number;
  zoneId?: number;
  donationRecordId?: number;
  status?: Appointment['status'];
  upcomingOnly?: boolean;
}

export interface DonationRecordListQuery {
  page?: number;
  pageSize?: number;
  zoneId?: number;
  category?: string;
  followUpRequired?: boolean;
  search?: string;
}

export type ZoneListResponse = PaginatedResponse<Zone>;
export type AppointmentListResponse = PaginatedResponse<Appointment>;
export type DonationRecordListResponse = PaginatedResponse<DonationRecord>;


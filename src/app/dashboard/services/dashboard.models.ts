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

export interface ZoneOption {
  id: number;
  name: string;
  country: string;
  isActive: boolean;
}

export interface Beneficiary {
  id: number;
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
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BeneficiaryListItem {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  country: string;
  state: string;
  zoneId: number;
  zoneName: string;
  totalDonationAmount: number;
  donationRecordCount: number;
  lastDonationAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BeneficiaryDetailsSummary {
  totalDonated: number;
  donationRecordCount: number;
  appointmentCount: number;
  lastDonationAt: string | null;
}

export interface BeneficiaryDetailsResponse {
  beneficiary: Beneficiary & {
    fullName: string;
    zoneName: string;
  };
  summary: BeneficiaryDetailsSummary;
  donationRecords: DonationRecord[];
  appointments: Appointment[];
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
  beneficiaryId: number;
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
  beneficiary: {
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
  };
  donationRecord: {
    mode: string;
    amount: number;
    donationCategory: string;
    followUpRequired: boolean;
    notes?: string | null;
  };
}

export interface DonationRecordCreateResponse {
  message: string;
  beneficiary: Beneficiary;
  donationRecord: DonationRecord;
}

export interface ZoneCreatePayload {
  name: string;
  country: string;
}

export interface ZoneCreateResponse {
  message: string;
  zone: Zone;
}

export interface ZoneListQuery {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  country?: string;
  state?: string;
  isActive?: boolean;
}

export interface BeneficiaryListQuery {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  zoneId?: number;
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

export interface ZoneListResponse extends PaginatedResponse<Zone> {
  pageIndex: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BeneficiaryListResponse extends PaginatedResponse<BeneficiaryListItem> {
  pageIndex: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ZoneOptionsResponse {
  items: ZoneOption[];
}

export type AppointmentListResponse = PaginatedResponse<Appointment>;
export type DonationRecordListResponse = PaginatedResponse<DonationRecord>;


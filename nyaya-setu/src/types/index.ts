// Core data types for Nyayasetu Mobile App

export interface ClaimStatus {
  referenceId: string;
  currentStatus: string;
  statusHistory: StatusUpdate[];
  lastSyncTime: Date;
  isOfflineData: boolean;
}

export interface StatusUpdate {
  status: string;
  description: string;
  timestamp: Date;
  officeName: string;
}

export interface Document {
  id: string;
  name:string;
  url: string;
  type: 'pdf' | 'image' | 'other';
}

export interface Claim {
  id: string;
  claimantName: string;
  claimType: 'Individual' | 'Community';
  status: string;
  submittedDate: string;
  area: string;
  documents: Document[];
  statusHistory: StatusUpdate[];
  location: { latitude: number; longitude: number };
  summary: string;
  referenceNumber?: string;
  priorityScore?: number | null;
  gramPanchayat?: string | null;
  tehsil?: string | null;
  district?: string | null;
  state?: string | null;
  landDescription?: string | null;
  // All claim_listings fields:
  claimId?: string | null;
  publicClaimId?: string | null;
  claimNumber?: string | null;
  claimantPhone?: string | null;
  phoneNumber?: string | null;
  village?: string | null;
  tribeName?: string | null;
  belongsToPvtg?: boolean | null;
  familySize?: number | null;
  annualIncome?: number | null;
  landArea?: number | null;
  currentStatus?: string | null;
  latestDescription?: string | null;
  applicationDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastSyncTime?: string | null;
  isOfflineData?: boolean | null;
  verificationStage?: string | null;
  officialNotes?: string | null;
  verificationDate?: string | null;
  verifiedBy?: string | null;
  recommendation?: string | null;
  verificationResult?: string | null;
  // Additional claim_listings fields:
  processedAt?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  claimPolygon?: any | null;
  fatherName?: string | null;
  gender?: string | null;
  aadhaar?: string | null;
  block?: string | null;
  pinCode?: string | null;
  documentCount?: number | null;
  avgHealthScore?: string | null;
  verificationCount?: number | null;
  statusIndicator?: number | null;
  claimAge?: string | null;
  submissionYear?: string | null;
  submissionMonth?: string | null;
  submissionDate?: string | null;
  processingTime?: string | null;
  hasAreaData?: boolean | null;
  hasLocationHierarchy?: boolean | null;
  hasGeometry?: boolean | null;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: any;
}

export interface UserProfile {
  userId: string;
  language: string;
  hasLandTitle: boolean;
  familySize: number;
  hasSchoolChildren: boolean;
  primaryOccupation: string;
  eligibleSchemes: Scheme[];
  name: string; // Added name property for personalized greeting
}

export interface Scheme {
  schemeId: string;
  name: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: string[];
  applicationProcess: string;
}

export interface MapData {
  claimId: string;
  coordinates: GeoCoordinate[];
  area: number;
  createdAt: Date;
  syncStatus: 'pending' | 'synced' | 'failed';
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isInfo?: boolean;
}

export interface NyayaMitraRequest {
  userId: string;
  language: SupportedLanguage;
  question: string;
}

export interface NyayaMitraResponse {
  response: string;
  conversationId: string;
  isAiAvailable: boolean;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  language: string;
}

export type SupportedLanguage = 'hi' | 'en' | 'or'; // Hindi, English, Odia

export type SyncOperationType = 'claim_sync' | 'map_upload' | 'profile_update';

export type SyncQueueItemPayload<TType extends SyncOperationType> =
  TType extends 'claim_sync'
    ? { referenceId: string }
    : TType extends 'map_upload'
      ? MapData
      : TType extends 'profile_update'
        ? UserProfile
        : never;

interface SyncQueueItemBase<TPayload, TType extends SyncOperationType> {
  id: number;
  operationType: TType;
  data: TPayload;
  createdAt: Date;
  retryCount: number;
}

export type SyncQueueItem =
  | SyncQueueItemBase<SyncQueueItemPayload<'claim_sync'>, 'claim_sync'>
  | SyncQueueItemBase<SyncQueueItemPayload<'map_upload'>, 'map_upload'>
  | SyncQueueItemBase<SyncQueueItemPayload<'profile_update'>, 'profile_update'>;

export interface StorageTableInfo {
  table: string;
  count: number;
}

export interface StorageInfo {
  totalSize: number;
  tableInfo: StorageTableInfo[];
}
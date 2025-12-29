import axios, { AxiosError, AxiosResponse } from 'axios';
import { isSupabaseConfigured } from './supabaseClient';
import {
  Claim,
  ClaimStatus,
  StatusUpdate,
  UserProfile,
  Scheme,
  ChatMessage,
  NyayaMitraRequest,
  NyayaMitraResponse,
} from '../types';

// Force real API path; Supabase is the primary source. Mocks remain only for legacy helpers.
const USE_MOCK_API = false;

console.log('[API] Using real API. Supabase configured =', isSupabaseConfigured);

const API_BASE_URL = __DEV__
  ? 'http://localhost:8000'
  : 'https://your-production-api.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorPayload, unknown>): Promise<unknown> => {
    console.error('API Error:', error);

    // Extract custom error message from backend if available
    if (error.response && error.response.data && error.response.data.detail) {
      const backendError = error.response.data.detail;
      const localizedMessage = backendError.message_hi; // Or based on current lang
      if (localizedMessage) {
        // Here you could use a toast or a global state to show the error
        console.error('Backend Message (HI):', localizedMessage);
      }
    }

    return Promise.reject(error);
  }
);

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type ClaimStatusHistoryDto = Omit<StatusUpdate, 'timestamp'> & { timestamp: string };

type ClaimStatusDto = {
  referenceId: string;
  currentStatus: string;
  statusHistory: ClaimStatusHistoryDto[];
  lastSyncTime: string;
  isOfflineData: boolean;
};

type SearchClaimsDto = {
  results: ClaimSearchResult[];
  total: number;
  query: string;
};

type ClaimSearchResult = {
  referenceId: string;
  currentStatus: string;
  lastUpdate: string;
  latestDescription: string;
};

type ChatResponseDto = {
  response: string;
  conversationId: string;
  timestamp: string;
  isAiAvailable: boolean;
};

type ChatStatusDto = {
  aiServiceAvailable: boolean;
  serviceName: string;
  supportedLanguages: string[];
  features: string[];
};

type SchemeSuggestionDto = {
  suggestedSchemes: Scheme[];
  totalSuggestions: number;
  profileSummary: SchemeProfileSummary;
};

type SchemeProfileSummary = {
  communityType?: string;
  areaType?: string;
  occupation?: string;
  economicStatus?: string;
};

type ClaimListing = {
  claim_id: string;
  public_claim_id: string | null;
  status: string | null;
  submitted_at: string | null;
  land_location_description: string | null;
  claim_type: string | null;
  priority_score: number | null;
  gram_panchayat: string | null;
  tehsil: string | null;
};

type BackendErrorPayload = {
  detail?: {
    message_hi?: string;
  };
};

const logApiError = (context: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError;
    const status = err.response?.status;
    const url = err.config?.url;
    const method = err.config?.method;
    const detail = (err.response?.data as any)?.detail;
    console.warn(`[API:${context}] Axios error`, { status, method, url, detail, message: err.message });
  } else {
    console.warn(`[API:${context}]`, error);
  }
};

const mapClaimStatus = (dto: ClaimStatusDto): ClaimStatus => ({
  ...dto,
  lastSyncTime: new Date(dto.lastSyncTime),
  statusHistory: dto.statusHistory.map(h => ({
    ...h,
    timestamp: new Date(h.timestamp),
  })),
});

const handleClaimError = (_error: unknown): ClaimStatus => {
  // Basic error handling, can be expanded
  return {
    referenceId: 'error',
    currentStatus: 'Error',
    statusHistory: [],
    lastSyncTime: new Date(),
    isOfflineData: true,
  };
};

const tryFetchClaimFromSupabase = async (referenceId: string): Promise<ClaimStatus | null> => {
  if (!isSupabaseConfigured) return null;

  try {
    console.log('[Supabase] Fetch claim', referenceId, 'from claims_status_view');

    // Primary path: view
    const { data, error } = await (await import('./supabaseClient')).supabase!
      .from('claims_status_view')
      .select('*')
      .eq('reference_id', referenceId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase claim fetch error (view):', error.message);
    }

    if (data) {
      const history = Array.isArray(data.status_history)
        ? data.status_history.map((h: any) => ({
            status: h.status ?? '',
            description: h.description ?? '',
            timestamp: new Date(h.timestamp ?? Date.now()),
            officeName: h.officeName ?? h.office_name ?? '',
          }))
        : [];

      const claim: ClaimStatus = {
        referenceId: data.reference_id ?? referenceId,
        currentStatus: data.current_status ?? 'Pending',
        statusHistory: history,
        lastSyncTime: new Date(data.last_sync_time ?? Date.now()),
        isOfflineData: Boolean(data.is_offline_data),
      };
      console.log('[Supabase] Claim fetched (view)', claim.referenceId, 'status', claim.currentStatus);
      return claim;
    }

    // Fallback: build from existing tables (claims + verifications)
    console.log('[Supabase] View empty, falling back to claims + verifications for', referenceId);
    const supabaseClient = (await import('./supabaseClient')).supabase!;

    const { data: claimRow, error: claimErr } = await supabaseClient
      .from('claims')
      .select('claim_id, public_claim_id, status, updated_at, submitted_at')
      .or(`public_claim_id.eq.${referenceId},claim_id.eq.${referenceId}`)
      .maybeSingle();

    if (claimErr) {
      console.warn('Supabase claim fetch error (claims table):', claimErr.message);
      return null;
    }
    if (!claimRow) return null;

    const claimId = claimRow.claim_id;

    const { data: verifications, error: verErr } = await supabaseClient
      .from('verifications')
      .select('verification_stage, official_notes, verification_date, created_at, verified_by, recommendation, verification_result')
      .eq('claim_id', claimId)
      .order('verification_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true, nullsFirst: false });

    if (verErr) {
      console.warn('Supabase verifications fetch error:', verErr.message);
    }

    const history = (verifications ?? []).map((v: any) => ({
      status: v.verification_stage ?? v.verification_result ?? 'Pending',
      description: v.official_notes ?? v.recommendation ?? '',
      timestamp: new Date(v.verification_date ?? v.created_at ?? Date.now()),
      officeName: v.verified_by ?? '',
    }));

    const claim: ClaimStatus = {
      referenceId: claimRow.public_claim_id ?? claimRow.claim_id,
      currentStatus: claimRow.status ?? (history.length ? history[history.length - 1].status : 'Pending'),
      statusHistory: history,
      lastSyncTime: new Date(claimRow.updated_at ?? claimRow.submitted_at ?? Date.now()),
      isOfflineData: false,
    };

    console.log('[Supabase] Claim fetched (fallback)', claim.referenceId, 'status', claim.currentStatus);
    return claim;
  } catch (err) {
    console.warn('Supabase claim fetch unexpected error:', err);
    return null;
  }
};

const trySearchClaimsFromSupabase = async (query: string): Promise<ClaimSearchResult[]> => {
  if (!isSupabaseConfigured) return [];

  try {
    if (!query || !query.trim()) {
      console.info('[Supabase] Search claims skipped: empty query');
      return [];
    }

    console.log('[Supabase] Search claims with query', query);

    const supabaseClient = (await import('./supabaseClient')).supabase!;
    const likeQuery = `%${query}%`;
    const digits = (query ?? '').replace(/\D/g, '');

    // 1) Prefer claim_listings view (broader, includes phone) and filter by ref/phone/text
    const { data: listings, error: listingsErr } = await supabaseClient
      .from('claim_listings')
      .select('*')
      .or(
        [
          `phone_number.eq.${query}`,
          digits ? `phone_number.eq.${digits}` : '',
        ].filter(Boolean).join(',') || undefined
      )
      .limit(200);

    if (!listingsErr && Array.isArray(listings) && listings.length) {
      const filtered = listings.filter((row: any) => {
        const phones = [row.claimant_phone, row.phone_number, row.mobile, row.phone, row.contact_number]
          .map((p: any) => (p ?? '').replace(/\D/g, ''));
        const textHits = [row.public_claim_id, row.claim_id, row.reference_id, row.claim_number]
          .some((v: any) => v?.toString().includes(query));
        const phoneHit = digits && phones.some((p: string) => p === digits);
        return Boolean(textHits || phoneHit);
      });

      const mapped = (filtered.length ? filtered : listings).map((row: any) => ({
        referenceId: row.reference_id ?? row.public_claim_id ?? row.claim_id ?? row.claim_number,
        currentStatus: row.current_status ?? row.status ?? 'Pending',
        lastUpdate: row.last_sync_time ?? row.updated_at ?? row.submitted_at ?? row.created_at ?? new Date().toISOString(),
        latestDescription: row.latest_description ?? '',
      }));

      console.log('[Supabase] Search results (claim_listings)', mapped.length);
      return mapped;
    }
    if (listingsErr) {
      console.warn('Supabase claim search error (claim_listings), falling back to view/tables:', listingsErr.message);
    }
    if (!listingsErr && (!listings || listings.length === 0)) {
      console.info('[Supabase] claim_listings returned 0 rows, falling back to view/tables for query', query);
    }

    // 2) Fallback to claims_status_view
    const { data, error } = await supabaseClient
      .from('claims_status_view')
      .select('*')
      .ilike('reference_id', likeQuery)
      .limit(20);

    let rows = data ?? [];
    if (error) {
      console.warn('Supabase claim search error (claims_status_view), falling back to claims:', error.message);
      const { data: claims, error: claimErr } = await supabaseClient
        .from('claims')
        .select('claim_id, public_claim_id, status, updated_at, submitted_at')
        .ilike('public_claim_id', likeQuery)
        .limit(20);
      if (claimErr) {
        console.warn('Supabase claim search error (claims table):', claimErr.message);
        return [];
      }
      rows = claims ?? [];
    }

    const results = rows.map((row: any) => ({
      referenceId: row.reference_id ?? row.public_claim_id ?? row.claim_id,
      currentStatus: row.current_status ?? row.status ?? 'Pending',
      lastUpdate: row.last_sync_time ?? row.updated_at ?? row.submitted_at ?? new Date().toISOString(),
      latestDescription: Array.isArray(row.status_history) && row.status_history.length
        ? row.status_history[row.status_history.length - 1]?.description ?? ''
        : '',
    }));

    console.log('[Supabase] Search results (fallback)', results.length);

    return results;
  } catch (err) {
    console.warn('Supabase claim search unexpected error:', err);
    return [];
  }
};


// --- API Service Definitions ---

const realApi = {
  // Claim Status
  async getClaimStatus(referenceId: string): Promise<ClaimStatus> {
    try {
      const supabaseClaim = await tryFetchClaimFromSupabase(referenceId);
      if (supabaseClaim) {
        return supabaseClaim;
      }

      const response: AxiosResponse<ApiResponse<ClaimStatusDto>> = await apiClient.get(
        `/api/v1/claims/${referenceId}/status`
      );
      if (!response.data.success) {
        throw new Error('API response indicates failure');
      }
      return mapClaimStatus(response.data.data);
    } catch (error) {
      logApiError('getClaimStatus', error);
      return handleClaimError(error);
    }
  },

  async syncClaimStatus(referenceId: string): Promise<ClaimStatus> {
    // For now, same as getClaimStatus (Supabase is source of truth)
    return this.getClaimStatus(referenceId);
  },

  // Search Claims
  async searchClaims(query: string): Promise<ClaimSearchResult[]> {
    try {
      const supabaseResults = await trySearchClaimsFromSupabase(query);
      if (isSupabaseConfigured) {
        // When Supabase is configured, rely on it even if empty to avoid network errors
        return supabaseResults;
      }

      const response: AxiosResponse<ApiResponse<SearchClaimsDto>> = await apiClient.get(
        `/api/v1/claims/search?query=${encodeURIComponent(query)}`
      );
      if (!response.data.success) {
        return [];
      }
      return response.data.data.results;
    } catch (error) {
      logApiError('searchClaims', error);
      return [];
    }
  },

  // Chat/Nyaya Mitra
  async sendMessage(
    request: NyayaMitraRequest,
  ): Promise<NyayaMitraResponse> {
    try {
      const { data } = await apiClient.post<ApiResponse<ChatResponseDto>>(
        '/chat/message',
        request,
      );
      return {
        ...data.data,
      };
    } catch (error) {
      logApiError('sendMessage', error);
      throw error;
    }
  },

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<ChatMessage[]>>(
        `/chat/history/${userId}`,
      );
      return data.data;
    } catch (error) {
      logApiError('getChatHistory', error);
      return [];
    }
  },

  async getChatStatus(): Promise<ChatStatusDto> {
    try {
      const { data } = await apiClient.get<ApiResponse<ChatStatusDto>>(
        '/chat/status',
      );
      return data.data;
    } catch (error) {
      logApiError('getChatStatus', error);
      return { aiServiceAvailable: false, serviceName: 'unavailable', supportedLanguages: [], features: [] };
    }
  },

  async getQuickQuestions(language: string): Promise<string[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<string[]>>(
        `/chat/quick-questions?language=${language}`,
      );
      return data.data;
    } catch (error) {
      logApiError('getQuickQuestions', error);
      return [];
    }
  },

  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data } = await apiClient.get<ApiResponse<UserProfile>>(
        `/user-profile/${userId}`,
      );
      return data.data;
    } catch (error) {
      logApiError('getUserProfile', error);
      throw error;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await apiClient.post('/user-profile', profile);
    } catch (error) {
      logApiError('saveUserProfile', error);
      throw error;
    }
  },

  // Schemes
  async suggestSchemes(profile: UserProfile): Promise<SchemeSuggestionDto> {
    try {
      const { data } = await apiClient.post<ApiResponse<SchemeSuggestionDto>>(
        '/schemes/suggest',
        profile,
      );
      return data.data;
    } catch (error) {
      logApiError('suggestSchemes', error);
      throw error;
    }
  },

  async getSchemeDetails(schemeId: string): Promise<Scheme> {
    try {
      const { data } = await apiClient.get<ApiResponse<Scheme>>(
        `/schemes/${schemeId}`,
      );
      return data.data;
    } catch (error) {
      logApiError('getSchemeDetails', error);
      throw error;
    }
  },

  async getClaimsByPhone(phone: string): Promise<Claim[]> {
    if (!isSupabaseConfigured) {
      console.warn('[API:getClaimsByPhone] Supabase not configured; returning empty list');
      return [];
    }

    if (!phone || !phone.trim()) {
      console.warn('[API:getClaimsByPhone] Empty phone number provided');
      return [];
    }

    const supabaseClient = (await import('./supabaseClient')).supabase!;
    const normalizePhone = (value?: string | null) => (value ?? '').replace(/\D/g, '');
    const target = normalizePhone(phone);

    console.log('[API:getClaimsByPhone] Fetching claims for phone:', phone, 'normalized:', target);

    // Primary approach: Fetch all records from claim_listings and filter by phone (most reliable)
    try {
      const { data: allListings, error: listingsError } = await supabaseClient
        .from('claim_listings')
        .select('*')
        .limit(500); // Increased limit to ensure we get all records

      if (listingsError) {
        console.warn('[API:getClaimsByPhone] Error fetching claim_listings:', listingsError.message);
      } else {
        console.log('[API:getClaimsByPhone] Fetched', allListings?.length ?? 0, 'records from claim_listings');
      }

      if (allListings && Array.isArray(allListings) && allListings.length > 0) {
        // Filter by normalized phone across all phone fields
        const filtered = allListings.filter((row: any) => {
          const candidates = [
            row.phone_number,
            row.claimant_phone,
            row.phone,
            row.mobile,
            row.contact_number,
          ];
          const normalizedCandidates = candidates.map(p => normalizePhone(p));
          const match = normalizedCandidates.some(p => p === target && p.length > 0);
          return match;
        });

        console.log('[API:getClaimsByPhone] Filtered to', filtered.length, 'matching records');

        if (filtered.length > 0) {
          return filtered.map((row: any) => ({
            id: row.reference_id ?? row.public_claim_id ?? row.claim_id ?? row.claim_number ?? `claim-${Date.now()}`,
            claimantName: row.claimant_name ?? 'Claimant',
            claimType: row.claim_type ?? 'Individual',
            status: row.current_status ?? row.status ?? 'Pending',
            submittedDate: row.submitted_at ?? row.application_date ?? row.created_at ?? '',
            area: row.land_location_description ?? row.area ?? '',
            documents: [],
            statusHistory: [],
            location: { latitude: 0, longitude: 0 },
            summary: row.latest_description ?? row.land_location_description ?? row.area ?? '',
            referenceNumber: row.public_claim_id ?? row.reference_id ?? row.claim_number ?? row.claim_id,
            priorityScore: row.priority_score ?? null,
            gramPanchayat: row.gram_panchayat ?? null,
            tehsil: row.tehsil ?? null,
            district: row.district ?? null,
            state: row.state ?? null,
            landDescription: row.land_location_description ?? row.area ?? null,
            // Map all claim_listings fields:
            claimId: row.claim_id ?? null,
            publicClaimId: row.public_claim_id ?? null,
            claimNumber: row.claim_number ?? null,
            claimantPhone: row.claimant_phone ?? null,
            phoneNumber: row.phone_number ?? null,
            village: row.village ?? null,
            tribeName: row.tribe_name ?? null,
            belongsToPvtg: row.belongs_to_pvtg ?? null,
            familySize: row.family_size ?? null,
            annualIncome: row.annual_income ?? null,
            landArea: row.land_area ?? null,
            currentStatus: row.current_status ?? row.status ?? null,
            latestDescription: row.latest_description ?? null,
            applicationDate: row.application_date ?? row.submitted_at ?? null,
            createdAt: row.created_at ?? null,
            updatedAt: row.updated_at ?? null,
            lastSyncTime: row.last_sync_time ?? null,
            isOfflineData: row.is_offline_data ?? null,
            verificationStage: row.verification_stage ?? null,
            officialNotes: row.official_notes ?? null,
            verificationDate: row.verification_date ?? null,
            verifiedBy: row.verified_by ?? null,
            recommendation: row.recommendation ?? null,
            verificationResult: row.verification_result ?? null,
            // Additional claim_listings fields:
            processedAt: row.processed_at ?? null,
            approvedAt: row.approved_at ?? null,
            rejectionReason: row.rejection_reason ?? null,
            claimPolygon: row.claim_polygon ?? null,
            fatherName: row.father_name ?? null,
            gender: row.gender ?? null,
            aadhaar: row.aadhaar ?? null,
            block: row.block ?? null,
            pinCode: row.pin_code ?? null,
            documentCount: row.document_count ?? null,
            avgHealthScore: row.avg_health_score ?? null,
            verificationCount: row.verification_count ?? null,
            statusIndicator: row.status_indicator ?? null,
            claimAge: row.claim_age ?? null,
            submissionYear: row.submission_year ?? null,
            submissionMonth: row.submission_month ?? null,
            submissionDate: row.submission_date ?? null,
            processingTime: row.processing_time ?? null,
            hasAreaData: row.has_area_data ?? null,
            hasLocationHierarchy: row.has_location_hierarchy ?? null,
            hasGeometry: row.has_geometry ?? null,
          }));
        } else {
          console.info('[API:getClaimsByPhone] No matching records found in claim_listings for phone', phone);
        }
      } else {
        console.info('[API:getClaimsByPhone] No records found in claim_listings');
      }
    } catch (err) {
      console.error('[API:getClaimsByPhone] Unexpected error:', err);
    }

    // Path B: claims_status_view
    const fromView = await supabaseClient
      .from('claims_status_view')
      .select('*')
      .limit(200);

    if (!fromView.error && Array.isArray(fromView.data)) {
      const filtered = fromView.data.filter((row: any) => {
        const candidates = [
          row.phone_number,
          row.claimant_phone,
          row.phone,
          row.mobile,
          row.contact_number,
        ];
        return candidates.some(p => normalizePhone(p) === target);
      });

      if (filtered.length > 0) {
        return filtered.map((row: any) => ({
          id: row.reference_id ?? row.public_claim_id ?? row.claim_id,
          claimantName: row.claimant_name ?? 'Claimant',
          claimType: row.claim_type ?? 'Individual',
          status: row.current_status ?? row.status ?? 'Pending',
          submittedDate: row.submitted_at ?? row.application_date ?? row.created_at ?? '',
          area: row.land_location_description ?? row.area ?? '',
          documents: [],
          statusHistory: [],
          location: { latitude: 0, longitude: 0 },
          summary: row.latest_description ?? row.land_location_description ?? row.area ?? '',
        }));
      } else {
        console.info('[API:getClaimsByPhone] No matches in claims_status_view for phone', phone);
      }
    } else if (fromView.error) {
      console.warn('Supabase getClaimsByPhone view error:', fromView.error.message);
    }

    // Fallback: join claims + claimants if the view is unavailable or empty for this phone
    const { data: rows, error: joinErr } = await supabaseClient
      .from('claims')
      .select(
        'claim_id, public_claim_id, status, submitted_at, land_location_description, claim_type, priority_score, gram_panchayat, tehsil, claimants!inner(phone_number, claimant_name)'
      )
      .eq('claimants.phone_number', phone)
      .limit(50);

    if (joinErr) {
      console.warn('Supabase getClaimsByPhone fallback error:', joinErr.message);
      return [];
    }

    if (rows && rows.length > 0) {
      return (rows as any[]).map(row => ({
        id: row.public_claim_id ?? row.claim_id,
        claimantName: row.claimants?.claimant_name ?? 'Claimant',
        claimType: row.claim_type ?? 'Individual',
        status: row.status ?? 'Pending',
        submittedDate: row.submitted_at ?? '',
        area: row.land_location_description ?? '',
        documents: [],
        statusHistory: [],
        location: { latitude: 0, longitude: 0 },
        summary: row.land_location_description ?? '',
      }));
    }

    console.info('[API:getClaimsByPhone] No claims found for phone', phone);
    return [];
  },

  async getAllSchemes(): Promise<Scheme[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Scheme[]>>(
        '/schemes',
      );
      return data.data;
    } catch (error) {
      logApiError('getAllSchemes', error);
      return [];
    }
  },
};

export const claimApi = {
  getClaimStatus: realApi.getClaimStatus,
  syncClaimStatus: realApi.syncClaimStatus,
  searchClaims: realApi.searchClaims,
};

export const api = realApi;


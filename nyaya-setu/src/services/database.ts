import { supabase, isSupabaseConfigured } from './supabaseClient';

import {
  ClaimStatus,
  UserProfile,
  Scheme,
  MapData,
  ChatMessage,
  SyncOperationType,
  SyncQueueItem,
  SyncQueueItemPayload,
  StorageInfo,
} from '../types';

// Supabase-backed database service (no mocks)
class DatabaseService {
  async init() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL/ANON_KEY.');
    }
    console.log('✅ Supabase database service initialized');
  }

  // --- Claim Status ---
  async addOrUpdateClaimStatus(claim: ClaimStatus): Promise<void> {
    if (!supabase) return;

    // Resolve claim row by public_claim_id or claim_id
    const { data: claimRow } = await supabase
      .from('claims')
      .select('claim_id, public_claim_id')
      .or(`public_claim_id.eq.${claim.referenceId},claim_id.eq.${claim.referenceId}`)
      .maybeSingle();

    let claimId = claimRow?.claim_id;

    if (!claimId) {
      const { data, error } = await supabase
        .from('claims')
        .insert({ public_claim_id: claim.referenceId, status: claim.currentStatus })
        .select('claim_id')
        .maybeSingle();
      if (error) throw error;
      claimId = data?.claim_id;
    } else {
      await supabase
        .from('claims')
        .update({ status: claim.currentStatus, updated_at: new Date().toISOString() })
        .eq('claim_id', claimId);
    }

    if (claim.statusHistory?.length) {
      const historyRows = claim.statusHistory.map(h => ({
        claim_id: claimId,
        verification_stage: h.status,
        official_notes: h.description,
        verification_date: h.timestamp,
        verified_by: h.officeName,
      }));
      await supabase.from('verifications').upsert(historyRows, { onConflict: 'id' });
    }
  }

  async getClaimStatus(referenceId: string): Promise<ClaimStatus | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('claims_status_view')
      .select('*')
      .eq('reference_id', referenceId)
      .maybeSingle();
    if (error) {
      console.warn('Supabase getClaimStatus error:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      referenceId: data.reference_id,
      currentStatus: data.current_status,
      statusHistory: (data.status_history || []).map((h: any) => ({
        status: h.status ?? '',
        description: h.description ?? '',
        timestamp: new Date(h.timestamp ?? Date.now()),
        officeName: h.officeName ?? '',
      })),
      lastSyncTime: new Date(data.last_sync_time ?? Date.now()),
      isOfflineData: Boolean(data.is_offline_data),
    };
  }

  async getClaimStatusHistory(): Promise<ClaimStatus[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from('claims_status_view').select('*');
    if (error) {
      console.warn('Supabase getClaimStatusHistory error:', error.message);
      return [];
    }
    return (data ?? []).map((row: any) => ({
      referenceId: row.reference_id,
      currentStatus: row.current_status,
      statusHistory: (row.status_history || []).map((h: any) => ({
        status: h.status ?? '',
        description: h.description ?? '',
        timestamp: new Date(h.timestamp ?? Date.now()),
        officeName: h.officeName ?? '',
      })),
      lastSyncTime: new Date(row.last_sync_time ?? Date.now()),
      isOfflineData: Boolean(row.is_offline_data),
    }));
  }

  // --- User Profile ---
  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!supabase) return;
    // Identify by phone number; let Supabase generate claimant_id (uuid default)
    const { data: existing, error: fetchErr } = await supabase
      .from('claimants')
      .select('claimant_id')
      .eq('phone_number', profile.userId)
      .maybeSingle();

    if (fetchErr) {
      console.warn('Supabase get claimant by phone error:', fetchErr.message);
      return;
    }

    const payload = {
      claimant_name: profile.name,
      phone_number: profile.userId,
      family_size: profile.familySize,
      annual_income: null,
      belongs_to_pvtg: null,
      village: null,
      district: null,
      state: null,
      tehsil: null,
      tribe_name: null,
    };

    if (existing?.claimant_id) {
      const { error } = await supabase
        .from('claimants')
        .update(payload)
        .eq('claimant_id', existing.claimant_id);
      if (error) console.warn('Supabase update claimant error:', error.message);
    } else {
      const { error } = await supabase.from('claimants').insert(payload);
      if (error) console.warn('Supabase insert claimant error:', error.message);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('claimants')
      .select('*')
      .eq('phone_number', userId)
      .maybeSingle();
    if (error) {
      console.warn('Supabase getUserProfile error:', error.message);
      return null;
    }
    if (!data) return null;

    return {
      userId: data.phone_number ?? userId,
      language: 'en',
      hasLandTitle: false,
      familySize: data.family_size ?? 0,
      hasSchoolChildren: false,
      primaryOccupation: '',
      eligibleSchemes: [],
      name: data.claimant_name ?? 'User',
    };
  }

  // --- Schemes (derived from dss_recommendations) ---
  async saveSchemes(_schemes: Scheme[]): Promise<void> {
    console.warn('saveSchemes is not supported on Supabase (no schemes table).');
  }

  async getSchemes(): Promise<Scheme[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('dss_recommendations')
      .select('scheme_name, recommendation_reason')
      .limit(100);
    if (error) {
      console.warn('Supabase getSchemes error:', error.message);
      return [];
    }
    const unique = new Map<string, Scheme>();
    (data ?? []).forEach((row: any) => {
      if (!unique.has(row.scheme_name)) {
        unique.set(row.scheme_name, {
          schemeId: row.scheme_name,
          name: row.scheme_name,
          description: row.recommendation_reason ?? 'Scheme recommendation',
          benefits: [],
          eligibilityCriteria: [],
          applicationProcess: '',
        });
      }
    });
    return Array.from(unique.values());
  }

  // --- Map Data ---
  async saveMapData(_mapData: MapData): Promise<void> {
    console.warn('saveMapData not implemented against Supabase schema');
  }

  async getMapData(_claimId: string): Promise<MapData | null> {
    return null;
  }

  // --- Chat History (not backed by Supabase schema) ---
  async saveChatMessage(_message: ChatMessage): Promise<void> {
    console.warn('Chat history persistence not implemented on Supabase');
  }

  async getChatHistory(_limit: number = 50): Promise<ChatMessage[]> {
    return [];
  }

  // --- Sync Queue (local placeholder) ---
  async addToSyncQueue<TType extends SyncOperationType>(
    _operationType: TType,
    _data: SyncQueueItemPayload<TType>
  ): Promise<void> {
    console.warn('Sync queue not implemented against Supabase schema');
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return [];
  }

  async removeSyncQueueItem(_id: number): Promise<void> {
    return;
  }

  async clearAllData(): Promise<void> {
    console.warn('clearAllData not implemented against Supabase schema');
  }

  async getStorageInfo(): Promise<StorageInfo> {
    return { totalSize: 0, tableInfo: [] };
  }
}

export const databaseService = new DatabaseService();
import NetInfo from '@react-native-community/netinfo';
import { databaseService } from './database';
import { claimApi } from './api';
import { AppStorageService } from './storage';
import { useAppStore } from '../store';
import { MapData, SyncQueueItem } from '../types';

export class SyncService {
  private static instance: SyncService;
  private isOnline: boolean = false;
  private syncInProgress: boolean = false;

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async initialize(): Promise<void> {
    // Monitor network connectivity
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected || false;
      
      // Update store
      useAppStore.getState().setInternetReachable(!this.isOnline);
      
      // If we just came online, trigger sync
      if (wasOffline && this.isOnline) {
        this.syncWhenOnline();
      }
    });

    // Check initial connectivity
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected || false;
    useAppStore.getState().setInternetReachable(!this.isOnline);
  }

  async syncWhenOnline(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    console.log('🔄 Starting background sync...');

    try {
      await this.processSyncQueue();
      await this.syncCachedData();
      await AppStorageService.setLastSyncTime(new Date());
      console.log('✅ Background sync completed');
    } catch (error) {
      console.error('❌ Background sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncQueue(): Promise<void> {
    const syncQueue = await databaseService.getSyncQueue();
    
    for (const item of syncQueue) {
      try {
        await this.processSyncItem(item);
        await databaseService.removeSyncQueueItem(item.id);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        // Could implement retry logic here
      }
    }
  }

  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    switch (item.operationType) {
      case 'claim_sync':
        await this.syncClaim(item.data.referenceId);
        return;
      // case 'map_upload':
      //   await this.uploadMapData(item.data);
      //   return;
      case 'profile_update':
        // Profile updates are local-only for privacy, so we ensure they are saved locally
        await databaseService.saveUserProfile(item.data);
        return;
    }
  }

  async syncClaim(referenceId: string): Promise<void> {
    try {
      const claimStatus = await claimApi.syncClaimStatus(referenceId);
      claimStatus.isOfflineData = false;
      claimStatus.lastSyncTime = new Date();
      
      await databaseService.addOrUpdateClaimStatus(claimStatus);
      
      // Update store
      useAppStore.getState().addClaimStatus(claimStatus);
      
      console.log(`✅ Synced claim ${referenceId}`);
    } catch (error) {
      console.error(`❌ Failed to sync claim ${referenceId}:`, error);
      throw error;
    }
  }

  /*
  async uploadMapData(mapData: MapData): Promise<void> {
    try {
      await mapApi.uploadMap(mapData);
      
      // Update local sync status
      mapData.syncStatus = 'synced';
      await databaseService.saveMapData(mapData);
      
      console.log(`✅ Uploaded map data for claim ${mapData.claimId}`);
    } catch (error) {
      console.error(`❌ Failed to upload map data:`, error);
      throw error;
    }
  }
  */

  private async syncCachedData(): Promise<void> {
    try {
      // Sync schemes if cache is expired
      if (await AppStorageService.isCacheExpired('schemes')) {
        // Note: We'll implement scheme syncing when we have the API endpoint
        console.log('Schemes cache expired, would sync if API was available');
      }
    } catch (error) {
      console.error('Failed to sync cached data:', error);
    }
  }

  // Manual sync methods
  async forceSyncClaim(referenceId: string): Promise<void> {
    if (!this.isOnline) {
      // Add to sync queue for later
      await databaseService.addToSyncQueue('claim_sync', { referenceId });
      throw new Error('Offline: Added to sync queue');
    }

    await this.syncClaim(referenceId);
  }

  async queueMapUpload(mapData: MapData): Promise<void> {
    // if (this.isOnline) {
    //   await this.uploadMapData(mapData);
    // } else {
    //   await databaseService.addToSyncQueue('map_upload', mapData);
    //   console.log('📤 Map data queued for upload when online');
    // }
    console.warn('queueMapUpload is not implemented');
  }

  // Utility methods
  isConnected(): boolean {
    return this.isOnline;
  }

  isSyncing(): boolean {
    return this.syncInProgress;
  }

  async getLastSyncTime(): Promise<Date | null> {
    return await AppStorageService.getLastSyncTime();
  }

  async getSyncQueueCount(): Promise<number> {
    const queue = await databaseService.getSyncQueue();
    return queue.length;
  }
}

export const syncService = SyncService.getInstance();
// Mock database service for web development
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ClaimStatus,
  UserProfile,
  Scheme,
  MapData,
  ChatMessage,
  SyncQueueItem,
  SyncOperationType,
  SyncQueueItemPayload,
  StorageInfo,
} from '../types';

type StoredStatusUpdate = {
  status: string;
  description: string;
  timestamp: string;
  officeName: string;
};

type StoredClaimStatus = Omit<ClaimStatus, 'lastSyncTime' | 'statusHistory'> & {
  lastSyncTime: string;
  statusHistory: StoredStatusUpdate[];
};

type StoredMapData = Omit<MapData, 'createdAt'> & { createdAt: string };

type StoredChatMessage = Omit<ChatMessage, 'timestamp'> & { timestamp: string };

type StoredSyncQueueItem = Omit<SyncQueueItem, 'createdAt'> & { createdAt: string };

class MockDatabaseService {
  private initialized = false;

  async init() {
    this.initialized = true;
    console.log('✅ Mock Database initialized for web development');
  }

  // Claim Status Methods
  async saveClaim(claim: ClaimStatus): Promise<void> {
    const claims = await this.getAllClaims();
    const updatedClaims = claims.filter(c => c.referenceId !== claim.referenceId);
    updatedClaims.push(claim);
    await AsyncStorage.setItem('claims', JSON.stringify(updatedClaims));
  }

  async getClaim(referenceId: string): Promise<ClaimStatus | null> {
    const claims = await this.getAllClaims();
    return claims.find(c => c.referenceId === referenceId) || null;
  }

  async getAllClaims(): Promise<ClaimStatus[]> {
    try {
      const claimsJson = await AsyncStorage.getItem('claims');
      if (!claimsJson) return [];
      
      const claims = JSON.parse(claimsJson) as StoredClaimStatus[];
      return claims.map((claim) => ({
        ...claim,
        lastSyncTime: new Date(claim.lastSyncTime),
        statusHistory: claim.statusHistory.map((status) => ({
          ...status,
          timestamp: new Date(status.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading claims:', error);
      return [];
    }
  }

  // User Profile Methods
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(`profile_${profile.userId}`, JSON.stringify(profile));
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profileJson = await AsyncStorage.getItem(`profile_${userId}`);
      return profileJson ? JSON.parse(profileJson) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Scheme Methods
  async saveSchemes(schemes: Scheme[]): Promise<void> {
    await AsyncStorage.setItem('schemes', JSON.stringify(schemes));
  }

  async getSchemes(): Promise<Scheme[]> {
    try {
  const schemesJson = await AsyncStorage.getItem('schemes');
  return schemesJson ? (JSON.parse(schemesJson) as Scheme[]) : [];
    } catch (error) {
      console.error('Error loading schemes:', error);
      return [];
    }
  }

  // Map Data Methods
  async saveMapData(mapData: MapData): Promise<void> {
    const maps = await this.getAllMapData();
    const updatedMaps = maps.filter(m => m.claimId !== mapData.claimId);
    updatedMaps.push(mapData);
    await AsyncStorage.setItem('maps', JSON.stringify(updatedMaps));
  }

  async getMapData(claimId: string): Promise<MapData | null> {
    const maps = await this.getAllMapData();
    return maps.find(m => m.claimId === claimId) || null;
  }

  async getAllMapData(): Promise<MapData[]> {
    try {
      const mapsJson = await AsyncStorage.getItem('maps');
      if (!mapsJson) return [];
      
      const maps = JSON.parse(mapsJson) as StoredMapData[];
      return maps.map((map) => ({
        ...map,
        createdAt: new Date(map.createdAt)
      }));
    } catch (error) {
      console.error('Error loading maps:', error);
      return [];
    }
  }

  // Chat History Methods
  async saveChatMessage(message: ChatMessage): Promise<void> {
    const history = await this.getChatHistory();
    history.unshift(message);
    // Keep only last 50 messages
    const trimmedHistory = history.slice(0, 50);
    await AsyncStorage.setItem('chat_history', JSON.stringify(trimmedHistory));
  }

  async getChatHistory(limit: number = 50): Promise<ChatMessage[]> {
    try {
      const historyJson = await AsyncStorage.getItem('chat_history');
      if (!historyJson) return [];
      
      const history = JSON.parse(historyJson) as StoredChatMessage[];
      return history.slice(0, limit).map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  // Sync Queue Methods
  async addToSyncQueue<TType extends SyncOperationType>(
    operationType: TType,
    data: SyncQueueItemPayload<TType>
  ): Promise<void> {
    const queue = await this.getSyncQueue();
    const newItem = this.createSyncQueueItem(operationType, data);
    const updatedQueue = [...queue, newItem];
    await this.saveSyncQueue(updatedQueue);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const queueJson = await AsyncStorage.getItem('sync_queue');
      if (!queueJson) return [];
      
      const queue = JSON.parse(queueJson) as StoredSyncQueueItem[];
      return queue.map((item) => this.deserializeSyncQueueItem(item));
    } catch (error) {
      console.error('Error loading sync queue:', error);
      return [];
    }
  }

  async removeSyncQueueItem(id: number): Promise<void> {
    const queue = await this.getSyncQueue();
    const updatedQueue = queue.filter(item => item.id !== id);
    await this.saveSyncQueue(updatedQueue);
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    const keys = ['claims', 'schemes', 'maps', 'chat_history', 'sync_queue'];
    for (const key of keys) {
      await AsyncStorage.removeItem(key);
    }
    
    // Clear user profiles
    const allKeys = await AsyncStorage.getAllKeys();
    const profileKeys = allKeys.filter(key => key.startsWith('profile_'));
    for (const key of profileKeys) {
      await AsyncStorage.removeItem(key);
    }
  }

  async getStorageInfo(): Promise<StorageInfo> {
    const claims = await this.getAllClaims();
    const schemes = await this.getSchemes();
    const maps = await this.getAllMapData();
    const history = await this.getChatHistory();
    const queue = await this.getSyncQueue();

    return {
      totalSize: 0, // AsyncStorage doesn't provide size info
      tableInfo: [
        { table: 'claims', count: claims.length },
        { table: 'schemes', count: schemes.length },
        { table: 'maps', count: maps.length },
        { table: 'chat_history', count: history.length },
        { table: 'sync_queue', count: queue.length }
      ]
    };
  }

  private async saveSyncQueue(queue: SyncQueueItem[]): Promise<void> {
    const serializedQueue: StoredSyncQueueItem[] = queue.map((item) => this.serializeSyncQueueItem(item));
    await AsyncStorage.setItem('sync_queue', JSON.stringify(serializedQueue));
  }

  private createSyncQueueItem<TType extends SyncOperationType>(
    operationType: TType,
    data: SyncQueueItemPayload<TType>
  ): SyncQueueItem {
    return {
      id: Date.now(),
      operationType,
      data,
      createdAt: new Date(),
      retryCount: 0,
    } as SyncQueueItem;
  }

  private serializeSyncQueueItem(item: SyncQueueItem): StoredSyncQueueItem {
    return {
      ...item,
      createdAt: item.createdAt.toISOString(),
    } as StoredSyncQueueItem;
  }

  private deserializeSyncQueueItem(item: StoredSyncQueueItem): SyncQueueItem {
    return {
      ...item,
      createdAt: new Date(item.createdAt),
    } as SyncQueueItem;
  }
}

export const mockDatabaseService = new MockDatabaseService();
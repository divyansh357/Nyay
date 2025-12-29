import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export class SecureStorageService {
  private static secureStoreSupported: boolean | null = null;

  private static async isSecureStoreAvailable(): Promise<boolean> {
    if (SecureStorageService.secureStoreSupported !== null) {
      return SecureStorageService.secureStoreSupported as boolean;
    }

    if (Platform.OS === 'web') {
      SecureStorageService.secureStoreSupported = false;
      return false;
    }

    try {
      SecureStorageService.secureStoreSupported = await SecureStore.isAvailableAsync();
    } catch (error) {
      console.error('SecureStore availability check failed:', error);
      SecureStorageService.secureStoreSupported = false;
    }

    return SecureStorageService.secureStoreSupported;
  }

  private static getFallbackKey(key: string): string {
    return `secure_${key}`;
  }

  // Secure storage for sensitive data using Keychain
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      if (await this.isSecureStoreAvailable()) {
        await SecureStore.setItemAsync(key, value, {
          keychainService: key,
        });
      } else {
        await AsyncStorage.setItem(this.getFallbackKey(key), value);
      }
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw error;
    }
  }

  static async getSecureItem(key: string): Promise<string | null> {
    try {
      if (await this.isSecureStoreAvailable()) {
        return await SecureStore.getItemAsync(key);
      }

      return await AsyncStorage.getItem(this.getFallbackKey(key));
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  static async removeSecureItem(key: string): Promise<void> {
    try {
      if (await this.isSecureStoreAvailable()) {
        await SecureStore.deleteItemAsync(key, {
          keychainService: key,
        });
      } else {
        await AsyncStorage.removeItem(this.getFallbackKey(key));
      }
    } catch (error) {
      console.error('Error removing secure item:', error);
      throw error;
    }
  }

  // Encrypted storage for user profile data
  static async setEncryptedItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setSecureItem(`encrypted_${key}`, jsonValue);
    } catch (error) {
      console.error('Error storing encrypted item:', error);
      throw error;
    }
  }

  static async getEncryptedItem<T>(key: string): Promise<T | null> {
    try {
      const storedValue = await this.getSecureItem(`encrypted_${key}`);
      if (storedValue) {
  return JSON.parse(storedValue) as T;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving encrypted item:', error);
      return null;
    }
  }

  static async removeEncryptedItem(key: string): Promise<void> {
    try {
      await this.removeSecureItem(`encrypted_${key}`);
    } catch (error) {
      console.error('Error removing encrypted item:', error);
      throw error;
    }
  }
}

export class AppStorageService {
  // Regular AsyncStorage for non-sensitive data
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing item:', error);
      throw error;
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error('Error retrieving item:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys];
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // App-specific storage methods
  static async setLanguage(language: string): Promise<void> {
    await this.setItem<string>('app_language', language);
  }

  static async getLanguage(): Promise<string> {
    const language = await this.getItem<string>('app_language');
    return language || 'hi'; // Default to Hindi
  }

  static async setLastSyncTime(timestamp: Date): Promise<void> {
    await this.setItem<string>('last_sync_time', timestamp.toISOString());
  }

  static async getLastSyncTime(): Promise<Date | null> {
    const timestamp = await this.getItem<string>('last_sync_time');
    return timestamp ? new Date(timestamp) : null;
  }

  static async setOfflineMode(isOffline: boolean): Promise<void> {
    await this.setItem<boolean>('offline_mode', isOffline);
  }

  static async getOfflineMode(): Promise<boolean> {
    const isOffline = await this.getItem<boolean>('offline_mode');
    return isOffline ?? false;
  }

  // Cache management
  static async setCacheExpiry(key: string, expiryHours: number = 24): Promise<void> {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + expiryHours);
    await this.setItem<string>(`${key}_expiry`, expiry.toISOString());
  }

  static async isCacheExpired(key: string): Promise<boolean> {
    const expiry = await this.getItem<string>(`${key}_expiry`);
    if (!expiry) return true;
    
    const expiryDate = new Date(expiry);
    return new Date() > expiryDate;
  }

  static async clearExpiredCache(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const expiryKeys = keys.filter(key => key.endsWith('_expiry'));
      
      for (const expiryKey of expiryKeys) {
        const dataKey = expiryKey.replace('_expiry', '');
        if (await this.isCacheExpired(dataKey)) {
          await this.removeItem(dataKey);
          await this.removeItem(expiryKey);
        }
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  CLAIMS_CACHE: 'claims_cache',
  SCHEMES_CACHE: 'schemes_cache',
  CHAT_HISTORY: 'chat_history',
  MAP_DATA: 'map_data',
  SYNC_QUEUE: 'sync_queue',
  APP_SETTINGS: 'app_settings',
  VOICE_SETTINGS: 'voice_settings',
  LOCATION_PERMISSIONS: 'location_permissions'
} as const;
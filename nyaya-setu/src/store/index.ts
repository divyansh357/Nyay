import { create } from 'zustand';
import { ClaimStatus, UserProfile, SupportedLanguage, ChatMessage, Scheme } from '../types';
import { databaseService } from '../services/database';
import { AppStorageService, SecureStorageService } from '../services/storage';

interface AppState {
  // User preferences
  language: SupportedLanguage;
  isInternetReachable: boolean;
  isInitialized: boolean;
  
  // Claim tracking
  claimStatuses: ClaimStatus[];
  
  // User profile
  user: UserProfile | null;
  
  // Chat history
  chatHistory: ChatMessage[];
  
  // Schemes
  schemes: Scheme[];
  
  // Sync status
  lastSyncTime: Date | null;
  syncInProgress: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  setInternetReachable: (isReachable: boolean) => void;
  addClaimStatus: (claim: ClaimStatus) => Promise<void>;
  updateUser: (user: UserProfile) => Promise<void>;
  addChatMessage: (message: ChatMessage) => Promise<void>;
  loadClaimsFromStorage: () => Promise<void>;
  loadChatHistory: () => Promise<void>;
  loadSchemes: () => Promise<void>;
  setSyncStatus: (inProgress: boolean, lastSync?: Date) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  language: 'hi',
  isInternetReachable: true,
  isInitialized: false,
  claimStatuses: [],
  user: null,
  chatHistory: [],
  schemes: [],
  lastSyncTime: null,
  syncInProgress: false,
  
  // Actions
  initialize: async () => {
    try {
      // Initialize database
      await databaseService.init();
      
      // Load saved language
      const savedLanguage = await AppStorageService.getLanguage();
      
      // Load offline status
      const isOffline = await AppStorageService.getOfflineMode();
      
      // Load last sync time
      const lastSyncTime = await AppStorageService.getLastSyncTime();
      
      // Load user profile if exists
  const profileData = await SecureStorageService.getEncryptedItem<UserProfile>('user_profile');
      
      set({
        language: savedLanguage as SupportedLanguage,
        isInternetReachable: isOffline,
        lastSyncTime,
        user: profileData,
        isInitialized: true
      });
      
      // Load data from storage
      await get().loadClaimsFromStorage();
      await get().loadChatHistory();
      await get().loadSchemes();
      
      console.log('✅ App store initialized');
    } catch (error) {
      console.error('❌ Failed to initialize app store:', error);
    }
  },

  setLanguage: async (language) => {
    await AppStorageService.setItem('app_language', language);
    set({ language });
  },
  setInternetReachable: (isReachable: boolean) => {
    set({ isInternetReachable: isReachable });
  },
  addClaimStatus: async (claimStatus: ClaimStatus) => {
    try {
      await databaseService.addOrUpdateClaimStatus(claimStatus);
      const updatedClaims = await databaseService.getClaimStatusHistory();
      set({ claimStatuses: updatedClaims });
    } catch (error) {
      console.error('Failed to add claim status:', error);
    }
  },

  updateUser: async (user) => {
    try {
      console.log('[Store] updateUser called with:', user);
      await databaseService.saveUserProfile(user);
      await SecureStorageService.setEncryptedItem('user_profile', user);
      set({ user: user });
      console.log('[Store] User state updated successfully');
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  addChatMessage: async (message) => {
    try {
      await databaseService.saveChatMessage(message);
      set((state) => ({
        chatHistory: [message, ...state.chatHistory.slice(0, 49)] // Keep last 50 messages
      }));
    } catch (error) {
      console.error('Failed to save chat message:', error);
    }
  },

  loadClaimsFromStorage: async () => {
    try {
      const claims = await databaseService.getClaimStatusHistory();
      set({ claimStatuses: claims });
    } catch (error) {
      console.error('Failed to load claims from storage:', error);
    }
  },

  loadChatHistory: async () => {
    try {
      const history = await databaseService.getChatHistory(50);
      set({ chatHistory: history });
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  },

  loadSchemes: async () => {
    try {
      const schemes = await databaseService.getSchemes();
      set({ schemes });
    } catch (error) {
      console.error('Failed to load schemes:', error);
    }
  },

  setSyncStatus: (syncInProgress, lastSyncTime) => {
    const updates: Partial<AppState> = { syncInProgress };
    if (lastSyncTime) {
      updates.lastSyncTime = lastSyncTime;
    }
    set(updates);
  },

}));
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../types';
import { translationService, type TranslationKey } from '../services/translationService';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const DEFAULT_LANGUAGE: SupportedLanguage = 'hi';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    void loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async (): Promise<void> => {
    try {
      // For now, just use default language without persistence
      // TODO: Add AsyncStorage back when dependency issues are resolved
      setLanguageState(DEFAULT_LANGUAGE);
      translationService.setLanguage(DEFAULT_LANGUAGE);
    } catch (error) {
      console.error('Error loading saved language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (language: SupportedLanguage): Promise<void> => {
    try {
      // Update state
      setLanguageState(language);
      
      // Update translation service
      translationService.setLanguage(language);
      
  // TODO: Add AsyncStorage back when dependency issues are resolved
  // await AsyncStorage.setItem('nyayasetu_selected_language', language);
      
      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error('Error saving language preference:', error);
      throw error;
    }
  };

  const t = (key: TranslationKey): string => {
    return translationService.translate(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
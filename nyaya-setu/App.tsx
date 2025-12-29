import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAppStore } from './src/store';
import { syncService } from './src/services/sync';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { paperTheme } from './src/theme/paperTheme';
import AuthScreen from './src/screens/AuthScreen';
import CustomSplashScreen from './src/screens/CustomSplashScreen';

const LoadingScreen = () => {
  const { t } = useLanguage();
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingTitle}>{t('loading_title')}</Text>
      <ActivityIndicator size="large" color={paperTheme.colors.primary} style={styles.loader} />
      <Text style={styles.loadingText}>{t('loading_text')}</Text>
      <Text style={styles.loadingSubtext}>{t('loading_subtext')}</Text>
    </View>
  );
};

const AppWithAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { initialize } = useAppStore();
  const user = useAppStore(state => state.user);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Nyayasetu App...');

        // Initialize app store (which initializes database)
        await initialize();

        // Initialize sync service
        await syncService.initialize();

        console.log('✅ App initialization complete');
        
        // Check if user is already authenticated
        if (user) {
          console.log('[App] User found during init:', user.userId);
          setIsAuthenticated(true);
        } else {
          console.log('[App] No user found during init');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setIsLoading(false);
      }
    };

    void initializeApp();
  }, [initialize]);
  
  // Separate effect to watch for user changes after initial load
  useEffect(() => {
    if (!isLoading && user) {
      console.log('[App] User state changed, setting authenticated:', user.userId);
      setIsAuthenticated(true);
    }
  }, [user, isLoading]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };
  
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthentication} />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" backgroundColor={paperTheme.colors.primary} />
    </>
  );
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <LanguageProvider>
        <AppWithAuth />
      </LanguageProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: paperTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: paperTheme.colors.primary,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 18,
    color: paperTheme.colors.onBackground,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: paperTheme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
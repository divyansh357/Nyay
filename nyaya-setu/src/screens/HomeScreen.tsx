import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Avatar,
  Button,
  List,
} from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppStore } from '../store';
import { useLanguage } from '../contexts/LanguageContext';
import { Claim, SupportedLanguage } from '../types';
import { OfflineIndicator, LanguageSelector } from '../components';
import { CustomTheme } from '../theme/types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services/api';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    schemes,
    lastSyncTime,
    user,
  } = useAppStore();
  const { language, setLanguage, t } = useLanguage();
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const fetchRecentClaims = async () => {
      try {
        const results = await api.searchClaims(user?.userId || '');

        // Map search results into lightweight Claim objects for display
        const mapped: Claim[] = results.slice(0, 3).map((r, idx) => ({
          id: r.referenceId || `claim-${idx}`,
          claimantName: user?.name || 'Claimant',
          claimType: 'Individual',
          status: r.currentStatus || 'Pending',
          submittedDate: r.lastUpdate || new Date().toISOString(),
          area: '',
          documents: [],
          statusHistory: [],
          location: { latitude: 0, longitude: 0 },
          summary: r.latestDescription || '',
        }));

        setRecentClaims(mapped);
      } catch (error) {
        console.error('Failed to fetch recent claims:', error);
      }
    };
    void fetchRecentClaims();
  }, [user]);


  const handleLanguageChange = (lang: SupportedLanguage) => {
    void setLanguage(lang);
  };

  const quickActions = [
    {
      title: t('home_qa_claim_title'),
      subtitle: t('home_qa_claim_subtitle'),
      icon: 'file-document-outline',
      onPress: () => navigation.navigate('ClaimTracker', {}),
    },
    {
      title: t('home_qa_mitra_title'),
      subtitle: t('home_qa_mitra_subtitle'),
      icon: 'chat-question-outline',
      onPress: () => navigation.navigate('NyayaMitra'),
    },
    {
      title: t('home_qa_schemes_title'),
      subtitle: t('home_qa_schemes_subtitle'),
      icon: 'text-box-search-outline',
      onPress: () => navigation.navigate('AdhikarSampark'),
    },
    {
      title: t('home_qa_mapping_title'),
      subtitle: t('home_qa_mapping_subtitle'),
      icon: 'map-marker-path',
      onPress: () => navigation.navigate('MappingTool'),
    },
  ];

  const renderRecentClaim = (claim: Claim) => (
    <Card
      key={claim.id}
      style={styles.recentClaimCard}
      onPress={() => navigation.navigate('ClaimTracker', { claimId: claim.id })}
    >
      <Card.Content>
        <Text variant="titleMedium">{claim.claimType}</Text>
        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
          {t('claim_id')}: {claim.id}
        </Text>
        <View style={styles.claimStatus}>
          <Text>{t('status')}:</Text>
          <Text style={{ color: theme.colors.primary }}>{claim.status}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button>{t('view_details')}</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <OfflineIndicator />
      <Card style={styles.headerCard}>
        <Card.Title
          title={`${t('welcome_title')} ${user?.name || ''}`}
          subtitle={t('welcome_subtitle')}
          left={props => <Avatar.Icon {...props} icon="account-circle" />}
          right={() => (
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          )}
        />
      </Card>

      <Card>
        <Card.Title title={t('home_quick_actions')} />
        <Card.Content>
          {quickActions.map(action => (
            <List.Item
              key={action.title}
              title={action.title}
              description={action.subtitle}
              left={props => <List.Icon {...props} icon={action.icon} />}
              onPress={action.onPress}
              style={styles.quickActionItem}
            />
          ))}
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title={t('home_recent_activity')} />
        <Card.Content>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall">{recentClaims.length}</Text>
              <Text variant="bodyMedium">{t('home_claims_saved')}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="headlineSmall">{schemes.length}</Text>
              <Text variant="bodyMedium">{t('home_schemes_available')}</Text>
            </View>
          </View>
          {lastSyncTime && (
            <Text style={styles.syncText}>
              {t('home_last_sync')}: {lastSyncTime.toLocaleString()}
            </Text>
          )}
        </Card.Content>
      </Card>

      {recentClaims.length > 0 && (
        <Card>
          <Card.Title
            title={t('home_recent_claims')}
            right={() =>
              <Button onPress={() => navigation.navigate('ClaimTracker', {})}>
                {t('home_view_all')}
              </Button>
            }
          />
          <Card.Content>
            {recentClaims.map(renderRecentClaim)}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.helpCard}>
        <Card.Content style={styles.helpContent}>
          <Avatar.Icon icon="chat-question" size={40} />
          <Text variant="bodyLarge" style={styles.helpText}>
            {t('home_help_text')}
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('NyayaMitra')}>
            {t('home_qa_mitra_title')}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    // Styles for header card
  },
  quickActionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  syncText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  recentClaimCard: {
    marginBottom: 8,
  },
  claimStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  helpCard: {
    // Styles for help card
  },
  helpContent: {
    alignItems: 'center',
    gap: 12,
  },
  helpText: {
    textAlign: 'center',
  },
});

export default HomeScreen;
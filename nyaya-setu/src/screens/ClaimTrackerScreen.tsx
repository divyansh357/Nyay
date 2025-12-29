import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAppStore } from '../store';
import { useLanguage } from '../contexts/LanguageContext';
import { claimApi } from '../services/api';
import { TimelineCard } from '../components';
import { CustomTheme } from '../theme/types';

type RootStackParamList = {
  ClaimTracker: { claimId?: string };
};

type ClaimTrackerScreenRouteProp = RouteProp<
  RootStackParamList,
  'ClaimTracker'
>;

const ClaimTrackerScreen: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const { t } = useLanguage();
  const route = useRoute<ClaimTrackerScreenRouteProp>();

  const [referenceId, setReferenceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { claimStatuses, addClaimStatus } = useAppStore();

  const handleSearchClaim = useCallback(
    async (searchId?: string) => {
      const idToSearch = (searchId || referenceId).trim();
      if (!idToSearch) {
        Alert.alert(t('error'), t('claim_tracker_enter_ref_id'));
        return;
      }

      setIsLoading(true);
      try {
        const claimData = await claimApi.getClaimStatus(idToSearch);
        if (claimData) {
          await addClaimStatus(claimData);
          setReferenceId(idToSearch);
        } else {
            Alert.alert(t('error'), t('claim_tracker_fetch_error'));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t('claim_tracker_fetch_error');
        Alert.alert(t('error'), message);
      } finally {
        setIsLoading(false);
      }
    },
    [referenceId, addClaimStatus, t],
  );

  useEffect(() => {
    // If a claimId is passed from another screen (e.g., Home), load it.
    if (route.params?.claimId) {
      const { claimId } = route.params;
      setReferenceId(claimId);
      // Automatically trigger search for the passed claimId if it's not already displayed
      if (!claimStatuses.some(c => c.referenceId === claimId)) {
        void handleSearchClaim(claimId);
      }
    }
  }, [route.params, claimStatuses, handleSearchClaim]);

  const handleSyncClaim = async (id: string) => {
    try {
      const updatedClaim = await claimApi.syncClaimStatus(id);
      await addClaimStatus(updatedClaim);
      Alert.alert(t('success'), t('claim_tracker_sync_success'));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('claim_tracker_sync_error');
      Alert.alert(t('error'), message);
    }
  };

  const displayedClaims = referenceId.trim()
    ? claimStatuses.filter(c => c.referenceId === referenceId.trim())
    : claimStatuses;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Title
          title={t('claimTracker')}
          subtitle={t('claim_tracker_subtitle')}
        />
        <Card.Content>
          <TextInput
            label={t('claim_tracker_ref_id_label')}
            value={referenceId}
            onChangeText={setReferenceId}
            mode="outlined"
            style={styles.input}
            autoCapitalize="characters"
            right={
              referenceId ? (
                <TextInput.Icon
                  icon="close-circle"
                  onPress={() => setReferenceId('')}
                />
              ) : null
            }
          />
          <Button
            mode="contained"
            onPress={() => handleSearchClaim()}
            disabled={isLoading}
            loading={isLoading}
            icon="magnify"
            style={styles.searchButton}
          >
            {t('search')}
          </Button>
        </Card.Content>
      </Card>

      {isLoading && !displayedClaims.length && (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      )}

      {displayedClaims.length > 0 ? (
        displayedClaims.map(claim => (
          <Card key={claim.referenceId} style={styles.card}>
            <Card.Title
              title={claim.referenceId}
              subtitle={`${t('status')}: ${claim.currentStatus}`}
              right={props => (
                <IconButton
                  {...props}
                  icon="sync"
                  onPress={() => handleSyncClaim(claim.referenceId)}
                />
              )}
            />
            <Card.Content>
              {claim.statusHistory.map((historyItem, index) => (
                <TimelineCard
                  key={index}
                  status={historyItem.status}
                  timestamp={historyItem.timestamp}
                  description={historyItem.description}
                  officeName={historyItem.officeName}
                  isLastItem={index === claim.statusHistory.length - 1}
                />
              ))}
            </Card.Content>
            {claim.lastSyncTime && (
              <Card.Actions>
                <Text style={styles.syncText}>
                  {t('home_last_sync')}: {new Date(claim.lastSyncTime).toLocaleString()}
                </Text>
              </Card.Actions>
            )}
          </Card>
        ))
      ) : (
        !isLoading && (
          <Card style={styles.card}>
            <Card.Content style={styles.noClaimsContent}>
              <Text variant="titleMedium">{t('claim_tracker_no_claims_title')}</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                {t('claim_tracker_no_claims_subtitle')}
              </Text>
            </Card.Content>
          </Card>
        )
      )}
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
  card: {
    
  },
  input: {
    marginBottom: 16,
  },
  searchButton: {
    
  },
  loader: {
    marginTop: 32,
  },
  syncText: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  noClaimsContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
});

export default ClaimTrackerScreen;
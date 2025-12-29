import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Appbar,
  Text,
  Button,
  Card,
  Title,
  Searchbar,
  ActivityIndicator,
  useTheme,
  Banner,
  Chip,
  FAB,
  Dialog,
  Portal,
  Paragraph,
  Divider,
} from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppStore } from '../store';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import TimelineCard from '../components/TimelineCard';
import EnhancedTimelineCard from '../components/EnhancedTimelineCard';
import OfflineIndicator from '../components/OfflineIndicator';
import { CustomTheme } from '../theme/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusUpdate } from '../types';
import { VoiceButton } from '../components/VoiceButton';

type ClaimTrackerRouteProp = RouteProp<RootStackParamList, 'ClaimTracker'>;
type ClaimTrackerNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ClaimTracker'
>;

const ClaimTrackerScreen = () => {
  const route = useRoute<ClaimTrackerRouteProp>();
  const navigation = useNavigation<ClaimTrackerNavigationProp>();
  const { colors } = useTheme() as CustomTheme;
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState<string>(route.params?.claimId || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showClaimOptions, setShowClaimOptions] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Animation for search results
  const [fadeAnim] = useState(new Animated.Value(0));

  const { 
    claimStatuses, 
    loadClaimsFromStorage, 
    isInternetReachable,
    saveClaim,
  } = useAppStore((state) => ({
    claimStatuses: state.claimStatuses,
    loadClaimsFromStorage: state.loadClaimsFromStorage,
    isInternetReachable: state.isInternetReachable,
    saveClaim: state.saveClaim,
  }));

  // Get claim from route params or search
  const [activeClaim, setActiveClaim] = useState<any | null>(null);

  useEffect(() => {
    // Load claims from storage on mount
    loadClaimsFromStorage();

    // If claimId is provided in route params, search for it immediately
    if (route.params?.claimId) {
      handleSearch();
    }

    // Show the banner if we're offline
    if (!isInternetReachable) {
      setShowBanner(true);
    }
  }, [route.params?.claimId, isInternetReachable]);

  // Animation for fade in of search results
  useEffect(() => {
    if (activeClaim) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [activeClaim]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError(t('claim_id_required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, check if we already have the claim in our local store
      const localClaim = claimStatuses.find(
        (claim) =>
          claim.referenceId.toLowerCase() === searchQuery.trim().toLowerCase()
      );

      if (localClaim) {
        setActiveClaim(localClaim);
        setLoading(false);
        return;
      }

      // If not in local store, fetch from API
      if (isInternetReachable) {
        const result = await api.getClaimStatus(searchQuery.trim());
        if (result) {
          setActiveClaim(result);
          // Also save to local storage for future offline access
          saveClaim(result);
        } else {
          setError(t('claim_not_found'));
        }
      } else {
        setError(t('offline_search_error'));
      }
    } catch (error) {
      console.error('Error searching claim:', error);
      setError(t('search_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!activeClaim) return;
    if (!isInternetReachable) {
      Alert.alert(t('offline_title'), t('offline_refresh_message'));
      return;
    }

    setRefreshing(true);
    try {
      const result = await api.getClaimStatus(activeClaim.referenceId);
      if (result) {
        setActiveClaim(result);
        saveClaim(result);
      }
    } catch (error) {
      console.error('Error refreshing claim:', error);
      Alert.alert(t('error'), t('refresh_error'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearSearch = () => {
    setActiveClaim(null);
    setSearchQuery('');
    setError(null);
  };

  // Function to get color based on claim status
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved')) return colors.success;
    if (statusLower.includes('reject')) return colors.error;
    if (statusLower.includes('review')) return colors.tertiary;
    if (statusLower.includes('pending')) return colors.warning;
    return colors.primary;
  };

  // Handler for saving a claim for offline use
  const handleSaveClaim = () => {
    if (activeClaim) {
      saveClaim(activeClaim);
      Alert.alert(
        t('success'),
        t('claim_saved_offline')
      );
    }
  };

  // Handler for reporting an issue with a claim
  const handleReportIssue = () => {
    if (!activeClaim) return;
    
    // Navigate to contact screen with claim reference
    navigation.navigate('AdhikarSampark', {
      subject: `Issue with claim ${activeClaim.referenceId}`,
      message: `I'm facing an issue with my claim (${activeClaim.referenceId}): `,
    });
    
    setFabOpen(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('claim_tracker')} />
        {activeClaim && (
          <Appbar.Action 
            icon="dots-vertical" 
            onPress={() => setShowClaimOptions(true)} 
          />
        )}
      </Appbar.Header>

      <OfflineIndicator />

      {showBanner && (
        <Banner
          visible={showBanner}
          icon="cloud-off-outline"
          actions={[
            {
              label: t('dismiss'),
              onPress: () => setShowBanner(false),
            },
          ]}
        >
          {t('offline_banner_message')}
        </Banner>
      )}

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Search section */}
        <Card style={styles.searchCard}>
          <Card.Content>
            <Title style={{ marginBottom: 8 }}>{t('search_claim')}</Title>
            <Searchbar
              placeholder={t('enter_claim_id')}
              onChangeText={setSearchQuery}
              value={searchQuery}
              onSubmitEditing={handleSearch}
              loading={loading}
              style={styles.searchBar}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSearch}
                loading={loading}
                disabled={loading || !searchQuery.trim()}
                style={styles.searchButton}
              >
                {t('search')}
              </Button>
              
              {searchQuery.length > 0 && (
                <Button
                  mode="outlined"
                  onPress={handleClearSearch}
                  disabled={loading}
                >
                  {t('clear')}
                </Button>
              )}
            </View>
            
            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}
            
            <View style={styles.voiceButtonContainer}>
              <VoiceButton
                onSpeechResult={(text) => {
                  setSearchQuery((prev) => `${prev} ${text}`.trim());
                }}
                color={colors.primary}
              />
              <Text style={styles.voiceHintText}>{t('tap_to_speak')}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Searches */}
        {!activeClaim && claimStatuses.length > 0 && (
          <Card style={styles.recentCard}>
            <Card.Content>
              <Title>{t('recent_claims')}</Title>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.recentChipsContainer}>
                  {claimStatuses.map((claim) => (
                    <Chip
                      key={claim.referenceId}
                      style={styles.recentChip}
                      onPress={() => {
                        setSearchQuery(claim.referenceId);
                        setActiveClaim(claim);
                      }}
                      icon="history"
                    >
                      {claim.referenceId}
                    </Chip>
                  ))}
                </View>
              </ScrollView>
            </Card.Content>
          </Card>
        )}

        {/* Claim Details */}
        {activeClaim && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card style={styles.claimCard}>
              <Card.Content>
                <Title style={styles.claimTitle}>{t('claim_details')}</Title>
                <View style={styles.claimHeader}>
                  <View>
                    <Text style={styles.claimIdLabel}>{t('claim_id')}</Text>
                    <Text style={styles.claimId}>
                      {activeClaim.referenceId}
                    </Text>
                  </View>
                  <Chip
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: getStatusColor(
                          activeClaim.currentStatus
                        ) + '20', // 20 is hex for 12% opacity
                      },
                    ]}
                  >
                    {activeClaim.currentStatus}
                  </Chip>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.claimInfoRow}>
                  <View style={styles.claimInfoItem}>
                    <Text style={styles.claimInfoLabel}>
                      {t('application_date')}
                    </Text>
                    <Text>
                      {new Date(
                        activeClaim.applicationDate || activeClaim.timestamp
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.claimInfoItem}>
                    <Text style={styles.claimInfoLabel}>
                      {t('claim_type')}
                    </Text>
                    <Text>{activeClaim.claimType || t('individual_claim')}</Text>
                  </View>
                </View>

                <View style={styles.claimInfoRow}>
                  <View style={styles.claimInfoItem}>
                    <Text style={styles.claimInfoLabel}>
                      {t('current_office')}
                    </Text>
                    <Text>{activeClaim.currentOffice}</Text>
                  </View>
                  <View style={styles.claimInfoItem}>
                    <Text style={styles.claimInfoLabel}>{t('last_updated')}</Text>
                    <Text>
                      {new Date(
                        activeClaim.lastUpdated || activeClaim.timestamp
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {activeClaim.areaDetails && (
                  <View style={styles.areaDetails}>
                    <Text style={styles.claimInfoLabel}>{t('area_details')}</Text>
                    <Text>{activeClaim.areaDetails}</Text>
                  </View>
                )}

                {activeClaim.additionalInfo && (
                  <View style={styles.additionalInfo}>
                    <Text style={styles.claimInfoLabel}>
                      {t('additional_info')}
                    </Text>
                    <Text>{activeClaim.additionalInfo}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>

            {/* Timeline */}
            <Card style={styles.timelineCard}>
              <Card.Content>
                <Title style={styles.timelineTitle}>{t('status_timeline')}</Title>
                
                {/* Progress bar */}
                <View style={styles.progressContainer}>
                  {activeClaim.statusUpdates && (
                    <View style={styles.progressTrack}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            width: `${calculateProgress(activeClaim.statusUpdates)}%`,
                            backgroundColor: calculateProgress(activeClaim.statusUpdates) === 100 
                              ? colors.success 
                              : colors.primary
                          }
                        ]} 
                      />
                    </View>
                  )}
                </View>
                
                {activeClaim.statusUpdates && activeClaim.statusUpdates.length > 0 ? (
                  <View style={styles.timeline}>
                    {activeClaim.statusUpdates.map((update: StatusUpdate, index: number) => (
                      <EnhancedTimelineCard
                        key={update.id || index}
                        status={update.status}
                        timestamp={update.timestamp}
                        description={update.description}
                        officeName={update.officeName}
                        isLastItem={index === activeClaim.statusUpdates.length - 1}
                      />
                    ))}
                  </View>
                ) : (
                  <Text>{t('no_status_updates')}</Text>
                )}
              </Card.Content>
            </Card>

            {/* Required Documents */}
            <Card style={styles.documentsCard}>
              <Card.Content>
                <Title style={styles.documentsTitle}>{t('required_documents')}</Title>
                <View style={styles.documentsList}>
                  {getRequiredDocuments(activeClaim.currentStatus).map((doc, index) => (
                    <View key={index} style={styles.documentItem}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.documentName}>{doc}</Text>
                    </View>
                  ))}
                </View>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // Navigate to document upload screen (to be implemented)
                    Alert.alert(
                      t('feature_coming_soon'),
                      t('document_upload_soon')
                    );
                  }}
                  style={styles.uploadButton}
                >
                  {t('upload_documents')}
                </Button>
              </Card.Content>
            </Card>

            {/* Next Steps */}
            <Card style={styles.nextStepsCard}>
              <Card.Content>
                <Title style={styles.nextStepsTitle}>{t('next_steps')}</Title>
                <Paragraph>
                  {getNextSteps(activeClaim.currentStatus)}
                </Paragraph>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('NyayaMitra')}
                  icon="chat-processing-outline"
                >
                  {t('ask_nyaya_mitra')}
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>
        )}
        
        {/* No active claim message */}
        {!activeClaim && !loading && searchQuery && error && (
          <View style={styles.noResultsContainer}>
            <MaterialCommunityIcons
              name="file-search-outline"
              size={60}
              color={colors.secondary}
            />
            <Text style={styles.noResultsText}>{t('no_results_found')}</Text>
            <Text style={styles.noResultsSubtext}>
              {t('try_different_id')}
            </Text>
          </View>
        )}

        {/* Help Guide */}
        {!activeClaim && !loading && !error && (
          <Card style={styles.helpCard}>
            <Card.Content>
              <Title style={styles.helpTitle}>{t('how_to_track')}</Title>
              <View style={styles.helpStep}>
                <View style={[styles.helpStepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.helpStepNumberText}>1</Text>
                </View>
                <Text style={styles.helpStepText}>{t('track_step_1')}</Text>
              </View>
              <View style={styles.helpStep}>
                <View style={[styles.helpStepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.helpStepNumberText}>2</Text>
                </View>
                <Text style={styles.helpStepText}>{t('track_step_2')}</Text>
              </View>
              <View style={styles.helpStep}>
                <View style={[styles.helpStepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.helpStepNumberText}>3</Text>
                </View>
                <Text style={styles.helpStepText}>{t('track_step_3')}</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Spacing at bottom */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating action button for quick actions */}
      {activeClaim && (
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'content-save',
              label: t('save_offline'),
              onPress: handleSaveClaim,
            },
            {
              icon: 'flag',
              label: t('report_issue'),
              onPress: handleReportIssue,
            },
            {
              icon: 'share-variant',
              label: t('share'),
              onPress: () => {
                Alert.alert(
                  t('feature_coming_soon'),
                  t('sharing_soon')
                );
              },
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          fabStyle={{ backgroundColor: colors.primary }}
        />
      )}

      {/* Options dialog */}
      <Portal>
        <Dialog visible={showClaimOptions} onDismiss={() => setShowClaimOptions(false)}>
          <Dialog.Title>{t('claim_options')}</Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity
              style={styles.dialogOption}
              onPress={() => {
                setShowClaimOptions(false);
                handleSaveClaim();
              }}
            >
              <MaterialCommunityIcons name="content-save" size={24} color={colors.primary} />
              <Text style={styles.dialogOptionText}>{t('save_offline')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dialogOption}
              onPress={() => {
                setShowClaimOptions(false);
                handleReportIssue();
              }}
            >
              <MaterialCommunityIcons name="flag" size={24} color={colors.primary} />
              <Text style={styles.dialogOptionText}>{t('report_issue')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dialogOption}
              onPress={() => {
                setShowClaimOptions(false);
                Alert.alert(
                  t('feature_coming_soon'),
                  t('sharing_soon')
                );
              }}
            >
              <MaterialCommunityIcons name="share-variant" size={24} color={colors.primary} />
              <Text style={styles.dialogOptionText}>{t('share')}</Text>
            </TouchableOpacity>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClaimOptions(false)}>{t('cancel')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

// Helper function to calculate progress based on status updates
const calculateProgress = (statusUpdates: StatusUpdate[]) => {
  if (!statusUpdates || statusUpdates.length === 0) return 0;
  
  const totalSteps = 6; // Typical steps in the claim process
  let completedSteps = 0;
  
  // Check for key statuses
  const statuses = statusUpdates.map(u => u.status.toLowerCase());
  
  if (statuses.some(s => s.includes('submit'))) completedSteps++;
  if (statuses.some(s => s.includes('verif'))) completedSteps++;
  if (statuses.some(s => s.includes('review'))) completedSteps++;
  if (statuses.some(s => s.includes('survey'))) completedSteps++;
  if (statuses.some(s => s.includes('title'))) completedSteps++;
  if (statuses.some(s => s.includes('approv'))) completedSteps = totalSteps;
  
  return Math.min(100, Math.round((completedSteps / totalSteps) * 100));
};

// Helper function to get required documents based on claim status
const getRequiredDocuments = (status: string) => {
  const statusLower = status.toLowerCase();
  
  const commonDocuments = [
    'Identity Proof (Aadhaar/Voter ID)',
    'Address Proof',
    'Caste Certificate (for ST claims)',
  ];
  
  if (statusLower.includes('submit') || statusLower.includes('receiv')) {
    return [
      ...commonDocuments,
      'Land Possession Evidence',
      'Gram Sabha Recommendation',
    ];
  }
  
  if (statusLower.includes('verif') || statusLower.includes('survey')) {
    return [
      ...commonDocuments,
      'Land Map with Survey Numbers',
      'Neighboring Land Details',
    ];
  }
  
  if (statusLower.includes('review')) {
    return [
      ...commonDocuments,
      'Previous Land Records (if any)',
      'Witness Statements',
    ];
  }
  
  if (statusLower.includes('appeal')) {
    return [
      ...commonDocuments,
      'Appeal Application',
      'Grounds for Appeal',
      'Supporting Evidence',
    ];
  }
  
  // Default/general documents
  return commonDocuments;
};

// Helper function to get next steps based on claim status
const getNextSteps = (status: string) => {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('submit') || statusLower.includes('receiv')) {
    return 'Your claim has been received. The verification process will begin shortly. Ensure all required documents are submitted and be prepared for a field verification visit.';
  }
  
  if (statusLower.includes('verif')) {
    return 'Field verification is in progress. Officials may contact you for a site visit. Please be available and have all land boundary markers clearly visible.';
  }
  
  if (statusLower.includes('survey')) {
    return 'Land survey is being conducted. Ensure you or a representative is present during the survey. Keep all documents ready for reference.';
  }
  
  if (statusLower.includes('review')) {
    return 'Your claim is under review by the committee. This process typically takes 4-6 weeks. You may be called for clarifications if needed.';
  }
  
  if (statusLower.includes('approv')) {
    return 'Congratulations! Your claim has been approved. You will receive your title document shortly. Contact the local office for collection details.';
  }
  
  if (statusLower.includes('reject')) {
    return 'Your claim has been rejected. You have 60 days to file an appeal. Please visit the "Adhikar Sampark" section to connect with legal aid for assistance with appeals.';
  }
  
  if (statusLower.includes('appeal')) {
    return 'Your appeal is being processed. Prepare to present your case before the appellate authority. Consider seeking legal assistance from the "Adhikar Sampark" section.';
  }
  
  // Default message
  return 'Continue to monitor your claim status for updates. If your claim has been pending at the current stage for more than 30 days, you can contact officials through the "Adhikar Sampark" section.';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  searchCard: {
    marginBottom: 16,
    elevation: 2,
  },
  searchBar: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchButton: {
    flex: 1,
    marginRight: 8,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
  voiceButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  voiceHintText: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  recentCard: {
    marginBottom: 16,
  },
  recentChipsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  recentChip: {
    marginRight: 8,
  },
  claimCard: {
    marginBottom: 16,
    elevation: 2,
  },
  claimTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  claimIdLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  claimId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 30,
  },
  divider: {
    marginVertical: 12,
  },
  claimInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  claimInfoItem: {
    flex: 1,
  },
  claimInfoLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  areaDetails: {
    marginTop: 4,
  },
  additionalInfo: {
    marginTop: 12,
  },
  timelineCard: {
    marginBottom: 16,
    elevation: 2,
  },
  timelineTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeline: {
    marginTop: 8,
  },
  documentsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  documentsTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  documentsList: {
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentName: {
    marginLeft: 8,
  },
  uploadButton: {
    marginTop: 8,
  },
  nextStepsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  nextStepsTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  helpCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  helpStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpStepNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  helpStepText: {
    flex: 1,
  },
  bottomSpacing: {
    height: 80,
  },
  dialogOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dialogOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ClaimTrackerScreen;
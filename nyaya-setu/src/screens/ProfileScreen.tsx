import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Linking, Alert, Modal, TouchableOpacity, Platform } from 'react-native';
import { Card, Text, Button, useTheme, Avatar, Divider, ActivityIndicator, Chip, IconButton, List } from 'react-native-paper';
import { useAppStore } from '../store';
import { api } from '../services/api';
import { Claim } from '../types';
import { CustomTheme } from '../theme/types';
import ClaimMapViewScreen from './ClaimMapViewScreen';
import { WebView } from 'react-native-webview';
import { downloadAsync, documentDirectory, getInfoAsync, readAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

const ProfileScreen: React.FC = () => {
  const { colors } = useTheme<CustomTheme>();
  const user = useAppStore(state => state.user);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  console.log('[ProfileScreen] Render - user:', user);

  const getLocalPdfUri = async () => {
    try {
      // Load the local PDF asset
      const asset = Asset.fromModule(require('../../assets/pdfs/form_a_odia.pdf'));
      await asset.downloadAsync();
      return asset.localUri || asset.uri;
    } catch (error) {
      console.error('Error loading local PDF:', error);
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const localUri = await getLocalPdfUri();
      
      if (localUri) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(localUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save Form A (Odia) Document',
            UTI: 'com.adobe.pdf',
          });
        } else {
          Alert.alert('Success', 'Document is ready to view!');
        }
      } else {
        throw new Error('Could not load PDF');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Error',
        'Unable to access the document. Please try again.'
      );
    }
  };

  const handleOpenPdf = async () => {
    try {
      const localUri = await getLocalPdfUri();
      
      if (localUri) {
        Alert.alert(
          'View Form A (Odia)',
          'Choose how you would like to view the document:',
          [
            { 
              text: 'Preview', 
              onPress: () => {
                // Use Google Docs viewer with the local file
                setPdfUri(localUri);
                setPdfVisible(true);
              }
            },
            {
              text: 'Share/Save',
              onPress: handleDownloadPdf
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } else {
        throw new Error('Could not load PDF');
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Unable to open the document. Please try again.');
    }
  };

  useEffect(() => {
    const load = async () => {
      console.log('[ProfileScreen] useEffect triggered, user state:', user);
      if (!user?.userId) {
        console.log('[ProfileScreen] No user ID available, user object:', JSON.stringify(user));
        return;
      }
      console.log('[ProfileScreen] Loading claims for user:', user.userId);
      setLoading(true);
      try {
        const result = await api.getClaimsByPhone(user.userId);
        console.log('[ProfileScreen] Loaded', result.length, 'claims');
        if (result.length > 0) {
          console.log('[ProfileScreen] First claim:', JSON.stringify(result[0], null, 2));
        }
        setClaims(result);
      } catch (e) {
        console.error('[ProfileScreen] Failed to load claims by phone', e);
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [user?.userId]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Card>
        <Card.Title
          title={user?.name || 'User'}
          subtitle={`Phone: ${user?.userId || 'Not set'}`}
          left={props => <Avatar.Icon {...props} icon="account" />}
          right={props => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton {...props} icon="refresh" onPress={() => {
                if (!user?.userId) {
                  console.log('[ProfileScreen] Refresh: No user ID available');
                  return;
                }
                console.log('[ProfileScreen] Refreshing claims for user:', user.userId);
                setLoading(true);
                api.getClaimsByPhone(user.userId)
                  .then(result => {
                    console.log('[ProfileScreen] Refresh: Loaded', result.length, 'claims');
                    setClaims(result);
                  })
                  .catch(err => {
                    console.error('[ProfileScreen] Refresh error', err);
                    setClaims([]);
                  })
                  .finally(() => setLoading(false));
              }} />
            </View>
          )}
        />
        <Card.Content>
          <View style={styles.row}>
            <Chip icon="home" style={styles.chip}>Claims: {claims.length}</Chip>
            <Chip icon="translate" style={styles.chip}>Lang: {user?.language}</Chip>
          </View>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 12 }} />

      <Card>
        <Card.Title title="Your claims" subtitle="Fetched from claim_listings" />
        <Card.Content>
          {loading && <ActivityIndicator animating color={colors.primary} />}
          {!loading && claims.length === 0 && (
            <Text style={{ color: colors.onSurfaceVariant }}>No claims found for this phone number.</Text>
          )}
          {!loading && claims.map(claim => (
            <Card key={claim.id} style={styles.claimCard}>
              <Card.Title title={claim.claimType || 'Claim'} subtitle={claim.referenceNumber || claim.id} />
              <Card.Content>
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>{claim.status}</Text>
                </View>
                <Divider style={{ marginVertical: 8 }} />

                {/* Basic Info */}
                <Text style={styles.sectionHeader}>Basic Information</Text>
                {claim.claimantName ? <Text style={styles.field}>Claimant: {claim.claimantName}</Text> : null}
                {claim.fatherName ? <Text style={styles.field}>Father: {claim.fatherName}</Text> : null}
                {claim.gender ? <Text style={styles.field}>Gender: {claim.gender}</Text> : null}
                {claim.aadhaar ? <Text style={styles.field}>Aadhaar: {claim.aadhaar}</Text> : null}
                {claim.phoneNumber || claim.claimantPhone ? <Text style={styles.field}>Phone: {claim.phoneNumber ?? claim.claimantPhone}</Text> : null}
                {claim.submittedDate || claim.applicationDate ? (
                  <Text style={styles.field}>Submitted: {new Date(claim.submittedDate || claim.applicationDate || '').toLocaleDateString()}</Text>
                ) : null}
                {claim.priorityScore !== undefined && claim.priorityScore !== null ? (
                  <Text style={styles.field}>Priority Score: {claim.priorityScore}</Text>
                ) : null}
                {claim.claimAge ? <Text style={styles.field}>Claim Age: {claim.claimAge}</Text> : null}
                {claim.documentCount !== null && claim.documentCount !== undefined ? (
                  <Text style={styles.field}>Documents: {claim.documentCount}</Text>
                ) : null}
                {claim.avgHealthScore ? <Text style={styles.field}>Avg Health Score: {claim.avgHealthScore}</Text> : null}

                {/* Location Details */}
                {(claim.village || claim.gramPanchayat || claim.block || claim.tehsil || claim.district || claim.state || claim.pinCode) ? (
                  <>
                    <Text style={styles.sectionHeader}>Location</Text>
                    {claim.village ? <Text style={styles.field}>Village: {claim.village}</Text> : null}
                    {claim.gramPanchayat ? <Text style={styles.field}>Gram Panchayat: {claim.gramPanchayat}</Text> : null}
                    {claim.block ? <Text style={styles.field}>Block: {claim.block}</Text> : null}
                    {claim.tehsil ? <Text style={styles.field}>Tehsil: {claim.tehsil}</Text> : null}
                    {claim.district ? <Text style={styles.field}>District: {claim.district}</Text> : null}
                    {claim.state ? <Text style={styles.field}>State: {claim.state}</Text> : null}
                    {claim.pinCode ? <Text style={styles.field}>PIN: {claim.pinCode}</Text> : null}
                    {claim.hasLocationHierarchy !== null ? (
                      <Text style={styles.field}>Complete Hierarchy: {claim.hasLocationHierarchy ? 'Yes' : 'No'}</Text>
                    ) : null}
                  </>
                ) : null}

                {/* Claimant Details */}
                {(claim.tribeName || claim.belongsToPvtg !== null || claim.familySize || claim.annualIncome) ? (
                  <>
                    <Text style={styles.sectionHeader}>Claimant Details</Text>
                    {claim.tribeName ? <Text style={styles.field}>Tribe: {claim.tribeName}</Text> : null}
                    {claim.belongsToPvtg !== null ? <Text style={styles.field}>PVTG: {claim.belongsToPvtg ? 'Yes' : 'No'}</Text> : null}
                    {claim.familySize ? <Text style={styles.field}>Family Size: {claim.familySize}</Text> : null}
                    {claim.annualIncome !== null ? <Text style={styles.field}>Annual Income: ₹{claim.annualIncome}</Text> : null}
                  </>
                ) : null}

                {/* Land Information */}
                {(claim.landArea || claim.landDescription || claim.area) ? (
                  <>
                    <Text style={styles.sectionHeader}>Land Information</Text>
                    {claim.landArea ? <Text style={styles.field}>Land Area: {claim.landArea} acres</Text> : null}
                    {claim.landDescription || claim.area ? (
                      <Text style={styles.field}>Description: {claim.landDescription || claim.area}</Text>
                    ) : null}
                  </>
                ) : null}

                {/* Verification Status */}
                {(claim.verificationStage || claim.verificationResult || claim.verifiedBy || claim.verificationDate || claim.verificationCount !== null) ? (
                  <>
                    <Text style={styles.sectionHeader}>Verification</Text>
                    {claim.verificationCount !== null && claim.verificationCount !== undefined ? (
                      <Text style={styles.field}>Verification Count: {claim.verificationCount}</Text>
                    ) : null}
                    {claim.verificationStage ? <Text style={styles.field}>Stage: {claim.verificationStage}</Text> : null}
                    {claim.verificationResult ? <Text style={styles.field}>Result: {claim.verificationResult}</Text> : null}
                    {claim.verifiedBy ? <Text style={styles.field}>Verified By: {claim.verifiedBy}</Text> : null}
                    {claim.verificationDate ? (
                      <Text style={styles.field}>Date: {new Date(claim.verificationDate).toLocaleDateString()}</Text>
                    ) : null}
                    {claim.officialNotes ? <Text style={styles.field}>Notes: {claim.officialNotes}</Text> : null}
                    {claim.recommendation ? <Text style={styles.field}>Recommendation: {claim.recommendation}</Text> : null}
                  </>
                ) : null}

                {/* Latest Update */}
                {claim.latestDescription || claim.summary ? (
                  <>
                    <Text style={styles.sectionHeader}>Latest Update</Text>
                    <Text style={styles.field}>{claim.latestDescription || claim.summary}</Text>
                  </>
                ) : null}

                {/* Processing Timeline */}
                {(claim.processedAt || claim.approvedAt || claim.rejectionReason || claim.processingTime) ? (
                  <>
                    <Text style={styles.sectionHeader}>Processing Timeline</Text>
                    {claim.submissionDate ? (
                      <Text style={styles.field}>Submission: {new Date(claim.submissionDate).toLocaleDateString()}</Text>
                    ) : null}
                    {claim.processedAt ? (
                      <Text style={styles.field}>Processed: {new Date(claim.processedAt).toLocaleDateString()}</Text>
                    ) : null}
                    {claim.approvedAt ? (
                      <Text style={styles.field}>Approved: {new Date(claim.approvedAt).toLocaleDateString()}</Text>
                    ) : null}
                    {claim.processingTime ? <Text style={styles.field}>Time Taken: {claim.processingTime}</Text> : null}
                    {claim.rejectionReason ? <Text style={styles.field}>Rejection: {claim.rejectionReason}</Text> : null}
                  </>
                ) : null}

                {/* Status Indicators */}
                {(claim.statusIndicator !== null || claim.submissionYear || claim.hasAreaData !== null || claim.hasGeometry !== null) ? (
                  <>
                    <Text style={styles.sectionHeader}>Status Indicators</Text>
                    {claim.statusIndicator !== null && claim.statusIndicator !== undefined ? (
                      <Text style={styles.field}>Status Code: {claim.statusIndicator}</Text>
                    ) : null}
                    {claim.submissionYear ? <Text style={styles.field}>Year: {claim.submissionYear}</Text> : null}
                    {claim.submissionMonth ? <Text style={styles.field}>Month: {claim.submissionMonth}</Text> : null}
                    {claim.hasAreaData !== null ? (
                      <Text style={styles.field}>Has Area Data: {claim.hasAreaData ? 'Yes' : 'No'}</Text>
                    ) : null}
                    {claim.hasGeometry !== null ? (
                      <Text style={styles.field}>Has Geometry: {claim.hasGeometry ? 'Yes' : 'No'}</Text>
                    ) : null}
                  </>
                ) : null}

                {/* Metadata */}
                <Text style={styles.sectionHeader}>Metadata</Text>
                {claim.claimId ? <Text style={styles.metaField}>Claim ID: {claim.claimId}</Text> : null}
                {claim.publicClaimId ? <Text style={styles.metaField}>Public ID: {claim.publicClaimId}</Text> : null}
                {claim.claimNumber ? <Text style={styles.metaField}>Number: {claim.claimNumber}</Text> : null}
                {claim.createdAt ? <Text style={styles.metaField}>Created: {new Date(claim.createdAt).toLocaleString()}</Text> : null}
                {claim.updatedAt ? <Text style={styles.metaField}>Updated: {new Date(claim.updatedAt).toLocaleString()}</Text> : null}
                {claim.lastSyncTime ? <Text style={styles.metaField}>Last Sync: {new Date(claim.lastSyncTime).toLocaleString()}</Text> : null}
                {claim.isOfflineData !== null ? <Text style={styles.metaField}>Offline: {claim.isOfflineData ? 'Yes' : 'No'}</Text> : null}

                {/* Documents Section */}
                <Text style={styles.sectionHeader}>Documents</Text>
                <List.Item
                  title="Form A (Odia)"
                  description="Individual/Community Rights Claim Form"
                  left={props => <List.Icon {...props} icon="file-pdf-box" color="#e74c3c" />}
                  onPress={handleOpenPdf}
                  style={{ paddingVertical: 0 }}
                />
                {claim.documents && claim.documents.length > 0 && claim.documents.map((doc, idx) => (
                  <List.Item
                    key={idx}
                    title={doc.name}
                    description={doc.type}
                    left={props => <List.Icon {...props} icon="file-document" />}
                    onPress={() => {
                      if (doc.url) {
                        Linking.openURL(doc.url).catch(() => 
                          Alert.alert('Error', 'Unable to open document')
                        );
                      }
                    }}
                    style={{ paddingVertical: 0 }}
                  />
                ))}
              </Card.Content>
              <Card.Actions>
                <Button 
                  icon="map-marker" 
                  onPress={() => {
                    setSelectedClaim(claim);
                    setMapVisible(true);
                  }}
                >
                  View on Map
                </Button>
                <Button icon="information-outline" onPress={() => { /* future: navigate to details */ }}>Details</Button>
              </Card.Actions>
            </Card>
          ))}
        </Card.Content>
      </Card>
      
      {/* Map Modal */}
      {selectedClaim && (
        <ClaimMapViewScreen
          claim={selectedClaim}
          visible={mapVisible}
          onClose={() => {
            setMapVisible(false);
            setSelectedClaim(null);
          }}
        />
      )}
      
      {/* PDF Viewer Modal */}
      <Modal
        visible={pdfVisible}
        animationType="slide"
        onRequestClose={() => {
          setPdfVisible(false);
          setPdfUri(null);
        }}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            padding: 16, 
            backgroundColor: colors.primary,
            elevation: 4 
          }}>
            <IconButton
              icon="arrow-left"
              iconColor="white"
              size={24}
              onPress={() => {
                setPdfVisible(false);
                setPdfUri(null);
              }}
            />
            <Text style={{ 
              flex: 1, 
              color: 'white', 
              fontSize: 18, 
              fontWeight: 'bold',
              marginLeft: 8
            }}>
              Form A Document
            </Text>
          </View>
          
          {pdfUri ? (
            Platform.OS === 'ios' ? (
              <WebView
                source={{ uri: pdfUri }}
                style={{ flex: 1 }}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 16, color: colors.onSurface }}>Loading PDF...</Text>
                  </View>
                )}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                  PDF Preview is not available on Android.
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: colors.onSurfaceVariant }}>
                  Please use the Share/Save button below to view the document.
                </Text>
                <Button 
                  mode="contained" 
                  icon="share"
                  onPress={handleDownloadPdf}
                >
                  Share/Save Document
                </Button>
              </View>
            )
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          
          <View style={{ padding: 16, backgroundColor: colors.surface, elevation: 8 }}>
            <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 8 }}>
              Form A - Individual/Community Forest Rights Claim Form (Odia)
            </Text>
            <Button 
              mode="contained" 
              icon="download"
              onPress={handleDownloadPdf}
            >
              Download PDF
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  chip: { marginRight: 8 },
  claimCard: { marginBottom: 12 },
  meta: { marginTop: 4, color: '#555' },
  sectionHeader: { fontSize: 14, fontWeight: '700', marginTop: 12, marginBottom: 4, color: '#2e7d32' },
  label: { fontWeight: '600', color: '#333' },
  field: { fontSize: 14, marginBottom: 4, color: '#333' },
  metaField: { fontSize: 12, marginBottom: 2, color: '#666' },
  pdfModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
  },
  pdfModalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfileScreen;

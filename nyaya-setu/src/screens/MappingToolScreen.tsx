import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Text,
  useTheme,
  Avatar,
  Dialog,
  Portal,
  Chip,
} from 'react-native-paper';
import * as Location from 'expo-location';
// Import Camera but don't use it directly to avoid TypeScript issues
import { Camera } from 'expo-camera';
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLanguage } from '../contexts/LanguageContext';
import { CustomTheme } from '../theme/types';
import { TranslationKey } from '../services/translationService';
import { mockLandParcels, mockPhotoLocations, mockMapRegion } from '../utils/mockMapData';

type Coordinate = {
  latitude: number;
  longitude: number;
};

type CapturedPhoto = {
  uri: string;
  location: Coordinate;
  timestamp: Date;
};

const MappingToolScreen: React.FC = () => {
  const { t } = useLanguage();
  const theme = useTheme<CustomTheme>();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [path, setPath] = useState<Coordinate[]>([]);
  const [area, setArea] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  // Camera and photo states
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [photoDialogVisible, setPhotoDialogVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
  const [showMockData, setShowMockData] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert(
          t('mapping_tool_location_permission_title'),
          t('mapping_tool_location_permission_message')
        );
        return;
      }

      // Request camera permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permissions to take photos of your land'
        );
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, [t]);

  // Effect to handle map view updates when toggling mock data
  useEffect(() => {
    if (mapRef.current && location) {
      if (showMockData) {
        // Animate to mock data region when showing sample data
        mapRef.current.animateToRegion(mockMapRegion, 500);
      } else {
        // Animate back to user's current location when hiding sample data
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }, 500);
      }
    }
  }, [showMockData, location]);
  
  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const startWatching = async () => {
      if (isRecording && !isPaused && !showMockData) {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000,
            distanceInterval: 1,
          },
          (newLocation) => {
            setLocation(newLocation);
            setPath((prevPath) => [
              ...prevPath,
              {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
              },
            ]);
          }
        );
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isRecording, isPaused, showMockData]);

  useEffect(() => {
    if (path.length > 2) {
      const newArea = calculateArea(path);
      setArea(newArea);
    } else {
      setArea(0);
    }
  }, [path]);

  const calculateArea = (coordinates: Coordinate[]) => {
    // This is a simplified calculation (shoelace formula) and might not be perfectly accurate.
    // For production, a more robust geospatial library should be used.
    let calculatedArea = 0;
    if (coordinates.length > 2) {
      for (let i = 0; i < coordinates.length; i++) {
        const p1 = coordinates[i];
        const p2 = coordinates[(i + 1) % coordinates.length];
        calculatedArea +=
          (p1.longitude * p2.latitude - p2.longitude * p1.latitude) *
          111320 *
          111320 *
          Math.cos((p1.latitude * Math.PI) / 180);
      }
    }
    return Math.abs(calculatedArea / 2);
  };

  const handleStart = () => {
    setIsRecording(true);
    setIsPaused(false);
    setPath([]);
    setArea(0);
    Alert.alert(t('mapping_tool_start_recording'), t('mapping_tool_gps_started'));
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    Alert.alert(
      isPaused
        ? t('mapping_tool_recording_resumed')
        : t('mapping_tool_recording_paused'),
      isPaused
        ? t('mapping_tool_gps_resumed')
        : t('mapping_tool_gps_paused')
    );
  };

  const handleSave = () => {
    setIsRecording(false);
    setIsPaused(false);
    Alert.alert(
      t('mapping_tool_map_saved'),
      `${t('mapping_tool_map_saved_success')}\n\n${t(
        'mapping_tool_total_points'
      )} ${path.length}\n${t('mapping_tool_estimated_area')} ${area.toFixed(
        2
      )} ${t('mapping_tool_sq_meters')}`,
      [{ text: t('mapping_tool_ok') }]
    );
  };

  const handleClear = () => {
    setPath([]);
    setArea(0);
    setIsRecording(false);
    setIsPaused(false);
    setClearDialogVisible(false);
    setCapturedPhotos([]);
  };

  const showClearDialog = () => setClearDialogVisible(true);
  const hideClearDialog = () => setClearDialogVisible(false);
  
  const toggleCamera = () => {
    setIsCameraVisible(!isCameraVisible);
  };

  // We've replaced this with direct implementation in the camera UI
  
  const showPhotoDetails = (photo: CapturedPhoto) => {
    setSelectedPhoto(photo);
    setPhotoDialogVisible(true);
  };
  
  const hidePhotoDialog = () => {
    setPhotoDialogVisible(false);
    setSelectedPhoto(null);
  };

  const renderInstructions = () => {
    const steps: TranslationKey[] = [
      'mapping_tool_step1',
      'mapping_tool_step2',
      'mapping_tool_step3',
      'mapping_tool_step4',
    ];
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('mapping_tool_instructions_title')}</Title>
          {steps.map((stepKey, index) => (
            <View style={styles.instructionItem} key={stepKey}>
              <Avatar.Text
                size={24}
                label={`${index + 1}`}
                style={styles.stepNumber}
              />
              <Paragraph style={styles.instructionText}>{t(stepKey)}</Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderControls = () => (
    <Card style={styles.card}>
      <Card.Title title={t('mapping_tool_controls_title')} />
      <Card.Content>
        {!isRecording ? (
          <View>
            <Button
              icon="play-circle"
              mode="contained"
              onPress={handleStart}
              style={styles.button}
              disabled={showMockData}
            >
              {t('mapping_tool_start_recording')}
            </Button>
            
            <Button
              icon={showMockData ? "eye-off" : "eye"}
              mode="contained-tonal"
              onPress={() => {
                setShowMockData(!showMockData);
                // Reset the UI state when toggling between modes
                if (isRecording) {
                  setIsRecording(false);
                  setIsPaused(false);
                }
                setPath([]);
              }}
              style={[styles.button, { backgroundColor: showMockData ? theme.colors.secondaryContainer : theme.colors.surfaceVariant }]}
            >
              {showMockData ? t('mapping_tool_hide_sample') : t('mapping_tool_show_sample')}
            </Button>
          </View>
        ) : (
          <View>
            <Button
              icon={isPaused ? 'play-circle' : 'pause-circle'}
              mode="outlined"
              onPress={handlePauseResume}
              style={styles.button}
            >
              {isPaused ? t('mapping_tool_resume') : t('mapping_tool_pause')}
            </Button>
            <Button
              icon="content-save"
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              disabled={path.length < 3}
            >
              {t('mapping_tool_save')}
            </Button>
          </View>
        )}
        <Button
          icon="delete-sweep"
          mode="text"
          onPress={showClearDialog}
          style={styles.button}
          textColor={theme.colors.error}
          disabled={path.length === 0 && !isRecording}
        >
          {t('mapping_tool_clear_map')}
        </Button>
      </Card.Content>
    </Card>
  );

  const renderParcelDialog = () => {
    if (!selectedParcel) return null;
    
    const parcel = mockLandParcels.find(p => p.id === selectedParcel);
    if (!parcel) return null;
    
    const statusColors = {
      approved: theme.colors.success,
      pending: theme.colors.warning,
      'in-review': theme.colors.info,
      rejected: theme.colors.error,
    };
    
    return (
      <Dialog visible={!!selectedParcel} onDismiss={() => setSelectedParcel(null)}>
        <Dialog.Title>{parcel.name}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{parcel.description}</Paragraph>
          <View style={styles.parcelInfoRow}>
            <Text style={styles.parcelInfoLabel}>Area:</Text>
            <Text>{parcel.area.toFixed(2)} sq. meters</Text>
          </View>
          <View style={styles.parcelInfoRow}>
            <Text style={styles.parcelInfoLabel}>Status:</Text>
            <Chip 
              style={{backgroundColor: statusColors[parcel.claimStatus]}} 
              textStyle={{color: 'white'}}
            >
              {parcel.claimStatus.toUpperCase()}
            </Chip>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setSelectedParcel(null)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  const renderStatus = () => (
    <Card style={styles.card}>
      <Card.Title title={t('mapping_tool_status_title')} />
      <Card.Content>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>{t('mapping_tool_gps_status')}</Text>
          <Text
            style={[
              styles.statusValue,
              {
                color: isRecording
                  ? isPaused
                    ? theme.colors.warning
                    : theme.colors.success
                  : theme.colors.onSurface,
              },
            ]}
          >
            {isRecording
              ? isPaused
                ? t('mapping_tool_gps_paused_status')
                : t('mapping_tool_gps_active')
              : t('mapping_tool_gps_off')}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>
            {t('mapping_tool_recorded_points')}
          </Text>
          <Text style={styles.statusValue}>{path.length}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>{t('mapping_tool_area')}</Text>
          <Text style={styles.statusValue}>
            {area.toFixed(2)} {t('mapping_tool_sq_meters')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPhotosCard = () => (
    <Card style={styles.card}>
      <Card.Title title="Land Photos" />
      <Card.Content>
        <View style={styles.photosContainer}>
          {capturedPhotos.length > 0 ? (
            <View style={styles.photoGrid}>
              {capturedPhotos.map((photo, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.photoThumbnail}
                  onPress={() => showPhotoDetails(photo)}
                >
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text>No photos taken yet. Use the camera button to add photos of your land.</Text>
          )}
        </View>
        <Button
          icon="camera"
          mode="contained"
          onPress={toggleCamera}
          style={styles.button}
          disabled={showMockData}
        >
          Take Photo
        </Button>
      </Card.Content>
    </Card>
  );

  // Function to take a simulated photo
  const takeSimulatedPhoto = () => {
    if (location) {
      // Create a mock photo with a timestamp
      const mockPhoto: CapturedPhoto = {
        // Use random image URLs that change each time
        uri: `https://picsum.photos/800/600?random=${Date.now()}`,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        timestamp: new Date()
      };
      setCapturedPhotos(prev => [...prev, mockPhoto]);
      setIsCameraVisible(false);
      Alert.alert('Photo Captured', 'Photo has been added to your land documentation');
    } else {
      Alert.alert('Error', 'Unable to determine location. Please try again.');
    }
  };
  
  // Check camera permission when activating camera
  useEffect(() => {
    if (isCameraVisible) {
      const checkPermission = async () => {
        try {
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Camera Permission Required',
              'Please grant camera permissions to take photos of your land',
              [{ text: 'OK', onPress: () => setIsCameraVisible(false) }]
            );
          }
        } catch (error) {
          console.error('Error checking camera permission:', error);
          Alert.alert('Camera Error', 'There was a problem accessing your camera');
          setIsCameraVisible(false);
        }
      };
      
      checkPermission();
    }
  }, [isCameraVisible]);
  
  // Simple mock camera implementation
  const renderCamera = () => {
    if (!isCameraVisible) return null;
    
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.camera}>
          <View style={styles.cameraButtonsContainer}>
            <TouchableOpacity style={styles.exitCameraButton} onPress={toggleCamera}>
              <Text style={styles.exitCameraText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.takePictureButton} onPress={takeSimulatedPhoto}>
              <View style={styles.takePictureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPhotoDialog = () => (
    <Dialog visible={photoDialogVisible} onDismiss={hidePhotoDialog}>
      <Dialog.Title>Photo Details</Dialog.Title>
      <Dialog.Content>
        {selectedPhoto && (
          <>
            <Image source={{ uri: selectedPhoto.uri }} style={styles.dialogPhoto} />
            <Text style={styles.photoInfoText}>
              Date: {selectedPhoto.timestamp.toLocaleDateString()}
            </Text>
            <Text style={styles.photoInfoText}>
              Location: {selectedPhoto.location.latitude.toFixed(6)}, {selectedPhoto.location.longitude.toFixed(6)}
            </Text>
          </>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hidePhotoDialog}>Close</Button>
      </Dialog.Actions>
    </Dialog>
  );

  return (
    <View style={styles.container}>
      {isCameraVisible ? (
        renderCamera()
      ) : (
        <>
          {location && (
            <MapView
              ref={mapRef}
              style={styles.map}
              region={showMockData ? mockMapRegion : {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}
              showsUserLocation={!showMockData}
              showsMyLocationButton={!showMockData}
            >
              {/* Display user path if not showing mock data */}
              {!showMockData && path.length > 1 && (
                <Polygon
                  coordinates={path}
                  strokeColor={theme.colors.primary}
                  fillColor="rgba(102, 51, 153, 0.3)"
                  strokeWidth={3}
                />
              )}
              
              {!showMockData && path.length > 0 && (
                <Marker coordinate={path[0]} title="Start Point" />
              )}
              
              {!showMockData && capturedPhotos.map((photo, index) => (
                <Marker 
                  key={`photo-${index}`}
                  coordinate={photo.location}
                  title={`Photo ${index + 1}`}
                  pinColor="blue"
                />
              ))}
              
              {/* Display mock land parcels if showing mock data */}
              {showMockData && mockLandParcels.map((parcel) => (
                <Polygon
                  key={parcel.id}
                  coordinates={parcel.coordinates}
                  strokeColor={theme.colors.primary}
                  fillColor={
                    selectedParcel === parcel.id
                      ? 'rgba(255, 165, 0, 0.5)' // Highlighted if selected
                      : parcel.claimStatus === 'approved'
                      ? 'rgba(46, 204, 113, 0.5)' // Green for approved
                      : parcel.claimStatus === 'in-review'
                      ? 'rgba(52, 152, 219, 0.5)' // Blue for in-review
                      : parcel.claimStatus === 'pending'
                      ? 'rgba(241, 196, 15, 0.5)' // Yellow for pending
                      : 'rgba(231, 76, 60, 0.5)'  // Red for rejected
                  }
                  strokeWidth={2}
                  onPress={() => setSelectedParcel(parcel.id)}
                />
              ))}
              
              {/* Display mock photo locations if showing mock data */}
              {showMockData && mockPhotoLocations.map((photo, index) => (
                <Marker 
                  key={`mockphoto-${index}`}
                  coordinate={photo.coordinate}
                  title={`Photo from ${photo.timestamp.toLocaleDateString()}`}
                  pinColor="blue"
                />
              ))}
            </MapView>
          )}
          <View style={styles.overlayContainer}>
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {renderInstructions()}
              {renderPhotosCard()}
              {renderStatus()}
              {renderControls()}
            </ScrollView>
          </View>
        </>
      )}
      <Portal>
        <Dialog visible={clearDialogVisible} onDismiss={hideClearDialog}>
          <Dialog.Title>{t('mapping_tool_clear_map')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t('mapping_tool_clear_map_confirm')}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideClearDialog}>{t('cancel')}</Button>
            <Button onPress={handleClear} textColor={theme.colors.error}>
              {t('confirm')}
            </Button>
          </Dialog.Actions>
        </Dialog>
        
        {renderPhotoDialog()}
        {renderParcelDialog()}
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    maxHeight: '60%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    marginBottom: 8,
    elevation: 4,
  },
  button: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  stepNumber: {
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusLabel: {
    fontWeight: 'bold',
  },
  statusValue: {
    fontSize: 16,
  },
  // Mock data styles
  parcelInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  parcelInfoLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Camera and photo styles
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cameraButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  exitCameraButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitCameraText: {
    color: 'white',
    fontSize: 18,
  },
  takePictureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePictureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  photosContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoThumbnail: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  dialogPhoto: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  photoInfoText: {
    marginVertical: 4,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Additional parcel dialog styles
  parcelDialogContent: {
    paddingVertical: 8,
  },
  parcelDialogLabel: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 14,
    color: '#555'
  },
  parcelDialogValue: {
    fontSize: 16,
    marginBottom: 8
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginVertical: 4
  },
  statusBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
});

export default MappingToolScreen;
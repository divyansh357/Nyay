import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Appbar, Card, Text, Chip, Button, useTheme } from 'react-native-paper';
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Claim } from '../types';
import { CustomTheme } from '../theme/types';

interface ClaimMapViewScreenProps {
  claim: Claim;
  visible: boolean;
  onClose: () => void;
}

type Coordinate = {
  latitude: number;
  longitude: number;
};

// Generate mock boundary coordinates based on claim data
// Uses forest area coordinates in Odisha/Chhattisgarh tribal regions
const generateMockBoundary = (claim: Claim): Coordinate[] => {
  // Use forest area coordinates in tribal regions of central India
  // Simla Palli Reserved Forest, Odisha (known for FRA claims)
  const baseLat = claim.latitude || 20.9517;
  const baseLng = claim.longitude || 85.0985;
  
  // Use claim ID to create consistent but varied offsets
  const seed = claim.id ? claim.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 12345;
  const random = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };
  
  // Create irregular polygon with 8-10 points for realistic boundary
  const baseOffset = 0.0006; // ~66 meters
  const points: Coordinate[] = [];
  const numPoints = 8 + Math.floor(random(0) * 3); // 8-10 points
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    // Add irregularity: vary radius between 0.7 and 1.3 of base
    const radiusVariation = 0.7 + random(i) * 0.6;
    // Add small random wobble to angle
    const angleWobble = (random(i + 100) - 0.5) * 0.3;
    
    const adjustedAngle = angle + angleWobble;
    const adjustedOffset = baseOffset * radiusVariation;
    
    points.push({
      latitude: baseLat + adjustedOffset * Math.cos(adjustedAngle),
      longitude: baseLng + adjustedOffset * Math.sin(adjustedAngle)
    });
  }
  
  return points;
};

// Generate mock photo locations around the boundary
const generateMockPhotoLocations = (claim: Claim): Coordinate[] => {
  // Use forest area coordinates
  const baseLat = claim.latitude || 20.9517;
  const baseLng = claim.longitude || 85.0985;
  
  // Use claim ID for consistent random placement
  const seed = claim.id ? claim.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 12345;
  const random = (index: number) => {
    const x = Math.sin(seed + index + 1000) * 10000;
    return x - Math.floor(x);
  };
  
  const photoOffset = 0.0004;
  const photos: Coordinate[] = [];
  
  // Place 4-6 photos at irregular positions around the boundary
  const numPhotos = 4 + Math.floor(random(0) * 3);
  for (let i = 0; i < numPhotos; i++) {
    const angle = (i / numPhotos) * 2 * Math.PI + (random(i) - 0.5) * 0.5;
    const distance = photoOffset * (0.8 + random(i + 50) * 0.4);
    
    photos.push({
      latitude: baseLat + distance * Math.cos(angle),
      longitude: baseLng + distance * Math.sin(angle)
    });
  }
  
  return photos;
};

const ClaimMapViewScreen: React.FC<ClaimMapViewScreenProps> = ({ claim, visible, onClose }) => {
  const theme = useTheme<CustomTheme>();
  const mapRef = useRef<MapView>(null);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showPhotos, setShowPhotos] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('hybrid');
  
  const boundaries = generateMockBoundary(claim);
  const photoLocations = generateMockPhotoLocations(claim);
  
  // Simla Palli Reserved Forest, Odisha - tribal FRA claim area
  const centerLat = claim.latitude || 20.9517;
  const centerLng = claim.longitude || 85.0985;
  
  const region = {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  };

  useEffect(() => {
    if (visible && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(region, 500);
      }, 300);
    }
  }, [visible]);

  const getStatusColor = () => {
    const status = claim.status?.toLowerCase();
    if (status?.includes('approved')) return theme.colors.success || '#2ecc71';
    if (status?.includes('pending')) return theme.colors.warning || '#f1c40f';
    if (status?.includes('review')) return theme.colors.info || '#3498db';
    if (status?.includes('reject')) return theme.colors.error || '#e74c3c';
    return theme.colors.primary;
  };

  const calculateArea = () => {
    // Simple area calculation using shoelace formula
    let area = 0;
    if (boundaries.length > 2) {
      for (let i = 0; i < boundaries.length; i++) {
        const p1 = boundaries[i];
        const p2 = boundaries[(i + 1) % boundaries.length];
        area +=
          (p1.longitude * p2.latitude - p2.longitude * p1.latitude) *
          111320 *
          111320 *
          Math.cos((p1.latitude * Math.PI) / 180);
      }
    }
    return Math.abs(area / 2);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={onClose} />
          <Appbar.Content title="Claim Location & Boundaries" subtitle={claim.referenceNumber || claim.id} />
        </Appbar.Header>

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          provider={PROVIDER_GOOGLE}
          mapType={mapType}
        >
          {/* Center marker for claim location */}
          <Marker
            coordinate={{ latitude: centerLat, longitude: centerLng }}
            title={claim.claimantName || 'Claim Location'}
            description={`Status: ${claim.status}`}
            pinColor={getStatusColor()}
          />

          {/* Land boundaries */}
          {showBoundaries && (
            <Polygon
              coordinates={boundaries}
              strokeColor={getStatusColor()}
              fillColor={`${getStatusColor()}40`} // 25% opacity
              strokeWidth={3}
            />
          )}

          {/* Photo/Evidence markers */}
          {showPhotos && photoLocations.map((coord, index) => (
            <Marker
              key={`photo-${index}`}
              coordinate={coord}
              title={`Evidence Photo ${index + 1}`}
              pinColor="blue"
            >
              <View style={styles.photoMarker}>
                <Text style={styles.photoMarkerText}>📷</Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Info overlay */}
        <View style={styles.overlay}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Claimant:</Text>
                <Text style={styles.value}>{claim.claimantName || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Village:</Text>
                <Text style={styles.value}>{claim.village || 'N/A'}</Text>
              </View>

              {claim.landArea && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Claimed Area:</Text>
                  <Text style={styles.value}>{claim.landArea} acres</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.label}>Boundary Area:</Text>
                <Text style={styles.value}>{calculateArea().toFixed(2)} sq. meters</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Coordinates:</Text>
                <Text style={styles.value}>
                  {centerLat.toFixed(6)}, {centerLng.toFixed(6)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Status:</Text>
                <Chip 
                  style={{ backgroundColor: getStatusColor() }}
                  textStyle={{ color: 'white', fontWeight: 'bold' }}
                >
                  {claim.status || 'Unknown'}
                </Chip>
              </View>
            </Card.Content>
          </Card>

          {/* Toggle controls */}
          <Card style={styles.controlCard}>
            <Card.Content>
              <View style={styles.controlRow}>
                <Button
                  mode={showBoundaries ? 'contained' : 'outlined'}
                  onPress={() => setShowBoundaries(!showBoundaries)}
                  style={styles.controlButton}
                  icon="vector-polygon"
                  compact
                >
                  Boundaries
                </Button>
                <Button
                  mode={showPhotos ? 'contained' : 'outlined'}
                  onPress={() => setShowPhotos(!showPhotos)}
                  style={styles.controlButton}
                  icon="camera"
                  compact
                >
                  Photos
                </Button>
              </View>
              <View style={styles.controlRow}>
                <Button
                  mode={mapType === 'standard' ? 'contained' : 'outlined'}
                  onPress={() => setMapType('standard')}
                  style={styles.controlButton}
                  icon="map"
                  compact
                >
                  Map
                </Button>
                <Button
                  mode={mapType === 'satellite' ? 'contained' : 'outlined'}
                  onPress={() => setMapType('satellite')}
                  style={styles.controlButton}
                  icon="earth"
                  compact
                >
                  Satellite
                </Button>
                <Button
                  mode={mapType === 'hybrid' ? 'contained' : 'outlined'}
                  onPress={() => setMapType('hybrid')}
                  style={styles.controlButton}
                  icon="layers"
                  compact
                >
                  Hybrid
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    marginBottom: 8,
  },
  controlCard: {
    marginBottom: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  photoMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  photoMarkerText: {
    fontSize: 18,
  },
});

export default ClaimMapViewScreen;

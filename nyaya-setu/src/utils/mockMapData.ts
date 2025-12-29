import { Region } from 'react-native-maps';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MockLandParcel {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinate[];
  area: number; // in square meters
  claimStatus: 'approved' | 'pending' | 'rejected' | 'in-review';
}

// Simla Palli Reserved Forest area in Odisha - known for FRA claims
// This is a dense forest region where tribal communities have land rights claims
const CENTRAL_LOCATION = {
  latitude: 20.9517,
  longitude: 85.0985,
};

export const mockMapRegion: Region = {
  latitude: CENTRAL_LOCATION.latitude,
  longitude: CENTRAL_LOCATION.longitude,
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

// Generate an irregular polygon around a central point to simulate natural land boundaries
const generatePolygon = (center: Coordinate, size: number, irregularity: number = 0.4): Coordinate[] => {
  const points = [];
  const numPoints = 8 + Math.floor(Math.random() * 4); // 8-11 points for irregular shape
  const angleStep = (2 * Math.PI) / numPoints;
  
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    // Add significant randomness for natural, uneven boundaries
    const randomizedSize = size * (0.7 + Math.random() * 0.6); // 70%-130% of base size
    // Add angular wobble
    const angleWobble = (Math.random() - 0.5) * 0.4;
    const adjustedAngle = angle + angleWobble;
    
    points.push({
      latitude: center.latitude + Math.sin(adjustedAngle) * randomizedSize,
      longitude: center.longitude + Math.cos(adjustedAngle) * randomizedSize,
    });
  }
  
  return points;
};

// Calculate area of a polygon using Shoelace formula (simplified for demo)
const calculateArea = (coordinates: Coordinate[]): number => {
  let area = 0;
  
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    area += coordinates[i].longitude * coordinates[j].latitude;
    area -= coordinates[j].longitude * coordinates[i].latitude;
  }
  
  // Convert to approximate square meters (very rough approximation)
  return Math.abs(area) * 111319.9 * 111319.9 / 2;
};

// Generate mock land parcels
export const mockLandParcels: MockLandParcel[] = [
  {
    id: 'parcel-1',
    name: 'Tribal Community Land',
    description: 'Traditional tribal land with established usage rights',
    coordinates: generatePolygon({
      latitude: CENTRAL_LOCATION.latitude + 0.0005,
      longitude: CENTRAL_LOCATION.longitude + 0.0007
    }, 0.0015),
    area: 8500,
    claimStatus: 'approved',
  },
  {
    id: 'parcel-2',
    name: 'Agricultural Plot',
    description: 'Land used for agriculture for 3 generations',
    coordinates: generatePolygon({
      latitude: CENTRAL_LOCATION.latitude - 0.001,
      longitude: CENTRAL_LOCATION.longitude + 0.0005
    }, 0.0012),
    area: 5200,
    claimStatus: 'in-review',
  },
  {
    id: 'parcel-3',
    name: 'Forest Dwelling Area',
    description: 'Area traditionally used for dwelling by forest communities',
    coordinates: generatePolygon({
      latitude: CENTRAL_LOCATION.latitude + 0.001,
      longitude: CENTRAL_LOCATION.longitude - 0.001
    }, 0.001),
    area: 3800,
    claimStatus: 'pending',
  },
  {
    id: 'parcel-4',
    name: 'Grazing Land',
    description: 'Community grazing area for livestock',
    coordinates: generatePolygon({
      latitude: CENTRAL_LOCATION.latitude - 0.0008,
      longitude: CENTRAL_LOCATION.longitude - 0.0015
    }, 0.0018),
    area: 9100,
    claimStatus: 'rejected',
  }
];

// Generate mock photos taken at specific locations
export const mockPhotoLocations: { coordinate: Coordinate, timestamp: Date }[] = [
  {
    coordinate: {
      latitude: CENTRAL_LOCATION.latitude + 0.0003,
      longitude: CENTRAL_LOCATION.longitude + 0.0005,
    },
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    coordinate: {
      latitude: CENTRAL_LOCATION.latitude - 0.0006,
      longitude: CENTRAL_LOCATION.longitude + 0.0008,
    },
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    coordinate: {
      latitude: CENTRAL_LOCATION.latitude + 0.0009,
      longitude: CENTRAL_LOCATION.longitude - 0.0004,
    },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  }
];
import { propertyService } from '../services/propertyService';
import { googleGeocodingService } from '../services/geocodingService';

// Interfaces for property types
export interface PropertyLocation {
  lat: number;
  lng: number;
}

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface PropertyPreview {
  _id: string;
  propertyName: string;
  location: string;
  price: number;
  coordinates: PropertyCoordinates;
  propertyType: string;
  action: string;
  images?: string[];
  distance?: number;
}

export interface PropertyCluster {
  gridX: number;
  gridY: number;
  count: number;
  properties: {
    id: string;
    name: string;
    price: number;
  }[];
  coordinates: PropertyCoordinates;
}

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get properties within a specified radius
export const getNearbyProperties = async (
  lat: number, 
  lng: number, 
  radius: number = 5 // Default 5km
): Promise<PropertyPreview[]> => {
  try {
    const response = await propertyService.getNearbyProperties(lat, lng, radius);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby properties:', error);
    throw error;
  }
};

// Get properties within map bounds
export const getPropertiesInMapBounds = async (
  northLat: number,
  southLat: number,
  eastLng: number,
  westLng: number
): Promise<PropertyPreview[]> => {
  try {
    const response = await propertyService.getPropertiesInBounds(northLat, southLat, eastLng, westLng);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties in bounds:', error);
    throw error;
  }
};

// Get property clusters for map visualization
export const getPropertyClusters = async (
  zoom: number
): Promise<PropertyCluster[]> => {
  try {
    const response = await propertyService.getPropertyClusters(zoom);
    return response.data;
  } catch (error) {
    console.error('Error fetching property clusters:', error);
    throw error;
  }
};

// Search properties near a named location
export const searchPropertiesNearLocation = async (
  locationName: string,
  distance: number = 10 // Default 10km
): Promise<PropertyPreview[]> => {
  try {
    // First, geocode the location name to get coordinates using Google services
    const locationData = await googleGeocodingService.searchLocation(locationName);
    
    // Then, search for properties near these coordinates
    const response = await propertyService.getNearbyProperties(
      locationData.lat, 
      locationData.lng, 
      distance
    );
    
    return response.data;
  } catch (error) {
    console.error('Error searching properties near location:', error);
    throw error;
  }
};

// Convert map bounds to bounding box for API requests
export const mapBoundsToBoundingBox = (bounds: L.LatLngBounds): {
  north: number,
  south: number,
  east: number,
  west: number
} => {
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();
  
  return {
    north: northEast.lat,
    south: southWest.lat,
    east: northEast.lng,
    west: southWest.lng
  };
};

// Calculate the map zoom level needed to fit a radius
export const getZoomLevelForRadius = (
  radius: number, 
  latitude: number,
  mapWidthInPixels: number = 1000
): number => {
  // Earth's circumference at equator
  const earthCircumference = 40075016.686;
  
  // Adjust for latitude (earth gets smaller toward the poles)
  const adjustedCircumference = earthCircumference * Math.cos(latitude * Math.PI / 180);
  
  // Calculate meters per pixel at zoom level 0
  const metersPerPixel = adjustedCircumference / 256;
  
  // Calculate required meters per pixel for our radius
  const requiredMetersPerPixel = (radius * 2000) / mapWidthInPixels;
  
  // Calculate zoom level
  const zoomLevel = Math.log2(metersPerPixel / requiredMetersPerPixel);
  
  return Math.floor(zoomLevel);
};

// Create a buffer in degrees around coordinates (approximate)
export const createCoordinateBuffer = (
  lat: number, 
  lng: number, 
  radiusKm: number
): { 
  north: number, 
  south: number, 
  east: number, 
  west: number 
} => {
  // Rough approximation: 1 degree of latitude ≈ 111 km
  const latBuffer = radiusKm / 111;
  
  // Longitude degrees vary with latitude
  const lngBuffer = radiusKm / (111 * Math.cos(lat * Math.PI / 180));
  
  return {
    north: lat + latBuffer,
    south: lat - latBuffer,
    east: lng + lngBuffer,
    west: lng - lngBuffer
  };
};

// Generate a Google Maps static image URL for a property
export const getStaticMapUrl = (
  lat: number, 
  lng: number, 
  width: number = 600, 
  height: number = 300, 
  zoom: number = 15
): string => {
  return `https://maps.googleapis.com/maps/api/staticmap?` +
    `center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&` +
    `markers=color:red%7C${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
};

export default {
  calculateDistance,
  getNearbyProperties,
  getPropertiesInMapBounds,
  getPropertyClusters,
  searchPropertiesNearLocation,
  mapBoundsToBoundingBox,
  getZoomLevelForRadius,
  createCoordinateBuffer,
  getStaticMapUrl
};
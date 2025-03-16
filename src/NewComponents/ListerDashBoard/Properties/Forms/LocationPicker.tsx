import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSearch, FaMapMarkerAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import { googleGeocodingService, PlacePrediction } from '../../../../services/geocodingService';
import SearchResultsDropdown from './SearchResultsDropdown';

interface LocationPickerProps {
  initialLocation?: string;
  initialCoordinates?: { lat: number; lng: number };
  onLocationSelect: (location: { 
    lat: number; 
    lng: number; 
    address: string;
  }) => void;
  height?: string;
  countryRestrictions?: string[];
  showMapControls?: boolean;
}

// Fix Leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  initialLocation,
  initialCoordinates,
  onLocationSelect,
  height = '400px',
  countryRestrictions = ['ke'], // Default to Kenya
  showMapControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownPortalRef = useRef<HTMLDivElement | null>(null);
  const [searchInput, setSearchInput] = useState(initialLocation || '');
  const [searchResults, setSearchResults] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [currentLocationError, setCurrentLocationError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    // Debug search results state
    console.log("=======================================");
    console.log("LocationPicker debug:");
    console.log("- searchResults:", searchResults.length);
    console.log("- showResults:", showResults);
    console.log("- searchInput:", searchInput);
    console.log("- isSearching:", isSearching);
    console.log("- inputRect:", searchInputRef.current?.getBoundingClientRect());
    console.log("=======================================");
  }, [searchResults, showResults, searchInput, isSearching]);
  
  
  // Create a portal element for the dropdown
  useEffect(() => {
    // Create a div for the portal if it doesn't exist
    if (!dropdownPortalRef.current) {
      const portalDiv = document.createElement('div');
      portalDiv.id = 'location-search-results-portal';
      portalDiv.style.position = 'absolute';
      portalDiv.style.zIndex = '10000';
      document.body.appendChild(portalDiv);
      dropdownPortalRef.current = portalDiv;
    }
    
    return () => {
      // Clean up the portal div on unmount
      if (dropdownPortalRef.current) {
        document.body.removeChild(dropdownPortalRef.current);
        dropdownPortalRef.current = null;
      }
    };
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    // Only initialize the map if showMapControls is true
    if (showMapControls && !mapRef.current && mapContainerRef.current) {
      // Default to a location in Kenya if no initial coordinates
      const defaultLat = initialCoordinates?.lat || -1.286389;
      const defaultLng = initialCoordinates?.lng || 36.817223;
      
      // Create map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false // We'll add zoom control manually for better placement
      }).setView([defaultLat, defaultLng], 13);
      
      // Add custom positioned zoom control
      L.control.zoom({
        position: 'topright'
      }).addTo(map);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add marker if initial coordinates are provided
      if (initialCoordinates && initialCoordinates.lat !== 0 && initialCoordinates.lng !== 0) {
        markerRef.current = L.marker([initialCoordinates.lat, initialCoordinates.lng], {
          icon: customIcon,
          draggable: true
        }).addTo(map);
        
        // Handle marker drag end
        markerRef.current.on('dragend', function() {
          const marker = markerRef.current;
          if (marker) {
            const position = marker.getLatLng();
            fetchAddress(position.lat, position.lng);
          }
        });
      }

      // Handle click events on map
      map.on('click', handleMapClick);
      
      mapRef.current = map;
    }
    
    // Even if we don't initialize the map, we should set the selected location if initial coords are provided
    if (initialCoordinates && initialCoordinates.lat !== 0 && initialCoordinates.lng !== 0) {
      if (initialLocation) {
        setSelectedLocation({
          lat: initialCoordinates.lat,
          lng: initialCoordinates.lng,
          address: initialLocation
        });
      } else if (mapRef.current) {
        // Only try to fetch the address if the map is initialized
        fetchAddress(initialCoordinates.lat, initialCoordinates.lng);
      }
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialCoordinates, initialLocation, showMapControls]);

  // Handle map click
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    
    // Update marker
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else if (mapRef.current) {
      markerRef.current = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true
      }).addTo(mapRef.current);
      
      // Handle marker drag end
      markerRef.current.on('dragend', function() {
        const marker = markerRef.current;
        if (marker) {
          const position = marker.getLatLng();
          fetchAddress(position.lat, position.lng);
        }
      });
    }
    
    // Get address for selected coordinates
    fetchAddress(lat, lng);
  };

  // Fetch address for coordinates using Google Geocoding
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      setIsSearching(true);
      
      const result = await googleGeocodingService.reverseGeocode(lat, lng);
      
      const newLocation = {
        lat,
        lng,
        address: result.formatted_address
      };
      
      setSelectedLocation(newLocation);
      setSearchInput(result.formatted_address);
      onLocationSelect(newLocation);
      setShowResults(false);
    } catch (error) {
      console.error('Error fetching address:', error);
      setSearchError('Failed to get address for this location. Please try again.');
      setTimeout(() => setSearchError(null), 5000);
    } finally {
      setIsSearching(false);
    }
  };

  // Search for location with Google Places Autocomplete
  const searchLocation = async (query: string) => {
    console.log(`Searching location for: "${query}"`);
    if (!query || query.length < 2) {
      console.log("Query too short, not searching");
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      console.log("Calling Google Places API...");
      const predictions = await googleGeocodingService.getPlacePredictions(query, {
        countryRestrictions
      });
      
      console.log(`Got ${predictions.length} predictions:`, predictions);
      setSearchResults(predictions);
      
      if (predictions.length > 0) {
        console.log("Setting showResults to TRUE");
        setShowResults(true);
      } else {
        console.log("No results found, still showing dropdown");
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchError('Search service unavailable. Please try again later or select a location on the map.');
    } finally {
      console.log("Search complete, setting isSearching to false");
      setIsSearching(false);
    }
  };
  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`Search input changed to: "${value}"`);
    setSearchInput(value);
    
    if (value.length >= 2) {
      console.log("Search input >=2 chars, setting isSearching to true");
      setIsSearching(true);
      searchLocation(value);
    } else {
      console.log("Search input <2 chars, clearing results");
      setSearchResults([]);
      setShowResults(false);
    }
  };
  

  // Fixed handleResultSelect function that resolves TypeScript errors
const handleResultSelect = async (prediction: PlacePrediction) => {
    console.log("🎯 Result selected:", prediction);
    
    try {
      setIsSearching(true);
      setShowResults(false); // Hide results immediately
      
      // Store the selected prediction description in case the geocode fails
      const fallbackAddress = prediction.description || "Selected location";
      setSearchInput(fallbackAddress);
      
      console.log("Geocoding place_id:", prediction.place_id);
      
      // First attempt to geocode the place_id
      try {
        const result = await googleGeocodingService.geocodePlaceId(prediction.place_id);
        
        console.log("Geocode result:", result);
        
        // Safely extract coordinates with fallbacks
        let lat = 0;
        let lng = 0;
        
        if (result.geometry && result.geometry.location) {
          // Check if location has lat/lng as functions (Google Maps API) or as properties
          if (typeof result.geometry.location.lat === 'function' && 
              typeof result.geometry.location.lng === 'function') {
            // TypeScript needs type assertion here to recognize these as functions
            const latFn = result.geometry.location.lat as unknown as () => number;
            const lngFn = result.geometry.location.lng as unknown as () => number;
            lat = latFn();
            lng = lngFn();
          } else {
            // Direct property access
            lat = result.geometry.location.lat as number;
            lng = result.geometry.location.lng as number;
          }
        }
        
        // Validate coordinates
        if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
          // If we can't get valid coordinates from geocoding the place_id, 
          // try geocoding the description text as fallback
          throw new Error('Invalid coordinates from place_id geocoding');
        }
        
        console.log("Valid coordinates found:", lat, lng);
        
        // Update map if it exists
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 16);
          
          // Update or create marker
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng], {
              icon: customIcon,
              draggable: true
            }).addTo(mapRef.current);
            
            // Handle marker drag end
            markerRef.current.on('dragend', function() {
              const marker = markerRef.current;
              if (marker) {
                const position = marker.getLatLng();
                fetchAddress(position.lat, position.lng);
              }
            });
          }
        }
        
        // Set selected location with valid address
        const newLocation = {
          lat,
          lng,
          address: result.formatted_address || fallbackAddress
        };
        
        setSelectedLocation(newLocation);
        setSearchInput(result.formatted_address || fallbackAddress);
        onLocationSelect(newLocation);
        
      } catch (geocodeError) {
        console.warn('Primary geocoding failed, trying fallback:', geocodeError);
        
        // Fallback: try to geocode the description text instead
        try {
          const locationResult = await googleGeocodingService.searchLocation(fallbackAddress);
          
          console.log("Fallback geocode result:", locationResult);
          
          if (mapRef.current) {
            mapRef.current.setView([locationResult.lat, locationResult.lng], 16);
            
            if (markerRef.current) {
              markerRef.current.setLatLng([locationResult.lat, locationResult.lng]);
            } else {
              markerRef.current = L.marker([locationResult.lat, locationResult.lng], {
                icon: customIcon,
                draggable: true
              }).addTo(mapRef.current);
              
              markerRef.current.on('dragend', function() {
                const marker = markerRef.current;
                if (marker) {
                  const position = marker.getLatLng();
                  fetchAddress(position.lat, position.lng);
                }
              });
            }
          }
          
          setSelectedLocation(locationResult);
          setSearchInput(locationResult.address);
          onLocationSelect(locationResult);
          
        } catch (fallbackError) {
          // If both approaches fail, show a clear error
          console.error('Both geocoding approaches failed:', fallbackError);
          throw new Error('Could not find this location. Please try another search or select on the map.');
        }
      }
      
    } catch (error) {
      console.error('Error selecting location:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to get location details. Please try again.');
      setTimeout(() => setSearchError(null), 5000);
    } finally {
      setIsSearching(false);
    }
  };
  // Handle input focus
  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  // Handle click outside of search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Add a slight delay to allow selection to complete first
      setTimeout(() => {
        // If the click is outside the search input and the dropdown
        if (
          searchInputRef.current && 
          !searchInputRef.current.contains(event.target as Node) &&
          !document.querySelector('#location-search-results-portal')?.contains(event.target as Node)
        ) {
          setShowResults(false);
        }
      }, 100);
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear search input
  const clearSearch = () => {
    setSearchInput('');
    setSearchResults([]);
    setShowResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    setGettingCurrentLocation(true);
    setCurrentLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          if (mapRef.current) {
            // Update map view
            mapRef.current.setView([latitude, longitude], 16);
            
            // Update marker
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              markerRef.current = L.marker([latitude, longitude], {
                icon: customIcon,
                draggable: true
              }).addTo(mapRef.current);
              
              // Handle marker drag end
              markerRef.current.on('dragend', function() {
                const marker = markerRef.current;
                if (marker) {
                  const position = marker.getLatLng();
                  fetchAddress(position.lat, position.lng);
                }
              });
            }
          }
          
          // Get address for current location
          fetchAddress(latitude, longitude);
          
          setGettingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          setCurrentLocationError(errorMessage);
          setGettingCurrentLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setCurrentLocationError('Geolocation is not supported by your browser');
      setGettingCurrentLocation(false);
    }
  };

  // Get the input element's position for dropdown placement
  const inputRect = searchInputRef.current?.getBoundingClientRect() || null;

  return (
    <div className="location-picker w-full">
      
<div className="search-container mb-4">
  <div className="flex flex-col space-y-2">
    <div className="relative w-full">
      <input
        ref={searchInputRef}
        type="text"
        className="w-full p-2 pl-9 pr-9 border border-gray-200 rounded-lg focus:border-celadon outline-none"
        placeholder="Search for a location"
        value={searchInput}
        onChange={handleSearchInputChange}
        onFocus={handleInputFocus}
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
      {searchInput && (
        <button 
          onClick={clearSearch}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          title="Clear search"
        >
          <FaTimes />
        </button>
      )}
    </div>
    
    <button 
      onClick={getCurrentLocation}
      disabled={gettingCurrentLocation}
      className="px-3 py-2 bg-celadon text-white rounded-lg hover:bg-celadon/90 flex items-center justify-center"
      title="Use my current location"
    >
      {gettingCurrentLocation ? (
        <FaSpinner className="animate-spin mr-2" />
      ) : (
        <FaMapMarkerAlt className="mr-2" />
      )}
      <span>Use current location</span>
    </button>
  </div>
  
  {currentLocationError && (
    <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
      {currentLocationError}
    </div>
  )}
  
  {searchError && (
    <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
      {searchError}
    </div>
  )}
  
  {isSearching && (
    <div className="flex justify-center my-2">
      <div className="animate-spin h-5 w-5 border-2 border-celadon border-t-transparent rounded-full"></div>
    </div>
  )}
</div>
      
      {/* Use the separate SearchResultsDropdown component */}
      <SearchResultsDropdown 
  show={showResults}
  searchInput={searchInput}
  searchResults={searchResults}
  isSearching={isSearching}
  inputRect={inputRect}
  portalElement={document.body} // Use document.body directly
  onResultSelect={handleResultSelect}
/>
      
      {/* Only render the map container if showMapControls is true */}
      {showMapControls && (
        <div className="relative" style={{ zIndex: 10 }}>
          <div 
            ref={mapContainerRef} 
            style={{ height, width: '100%' }} 
            className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
          ></div>
          <div className="absolute bottom-2 right-2 bg-white p-2 rounded-lg shadow-md text-xs text-gray-600">
            Click on map or drag marker to set location
          </div>
        </div>
      )}
      
      {selectedLocation && (
        <div className="selected-location mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="font-helvetica-regular text-slategray">Selected Location:</p>
          <p className="font-helvetica-light text-sm text-gray-600 mt-1">{selectedLocation.address}</p>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              Lat: {selectedLocation.lat.toFixed(6)}, 
              Lng: {selectedLocation.lng.toFixed(6)}
            </p>
            {showMapControls && (
              <button 
                onClick={() => {
                  if (mapRef.current && selectedLocation) {
                    mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 16);
                  }
                }}
                className="text-xs text-celadon hover:underline"
              >
                Center on map
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
import { debounce } from 'lodash';

// Interface for Google Places predictions
export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: Array<{
      offset: number;
      length: number;
    }>;
  };
}

// Interface for Google geocoding results
export interface GoogleGeocodingResult {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  types: string[];
}

// Cache for autocomplete results
interface AutocompleteCache {
  [key: string]: {
    results: PlacePrediction[];
    timestamp: number;
  }
}

// Cache for geocoding results
interface GeocodingCache {
  [key: string]: {
    result: GoogleGeocodingResult;
    timestamp: number;
  }
}

// Class to handle Google Places and Geocoding operations
class GeocodingService {
  private static instance: GeocodingService;
  private autocompleteCache: AutocompleteCache = {};
  private geocodingCache: GeocodingCache = {};
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private readonly API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  private scriptLoaded: boolean = false;
  private scriptLoading: boolean = false;
  private loadingPromise: Promise<void> | null = null;
  
  // Google Places Autocomplete service
  private autocompleteService: any = null;
  
  // Google Geocoder service
  private geocoder: any = null;
  
  private constructor() {
    // Check if script is already loaded
    if (typeof window !== 'undefined' && 
        typeof (window as any).google !== 'undefined' && 
        typeof (window as any).google.maps !== 'undefined' &&
        typeof (window as any).google.maps.places !== 'undefined') {
      this.scriptLoaded = true;
      this.initGoogleServices();
    } else {
      // Load the script right away
      this.loadGoogleMapsScript().then(() => {
        this.initGoogleServices();
      }).catch(error => {
        console.error('Failed to load Google Maps script:', error);
      });
    }
  }
  
  // Initialize Google services when needed
  private initGoogleServices(): void {
    if (!this.scriptLoaded) {
      console.log('Cannot initialize Google services - script not loaded');
      return;
    }
    
    console.log('Initializing Google services, google object:', typeof (window as any).google !== 'undefined' ? 'defined' : 'undefined');
    
    if (typeof (window as any).google !== 'undefined') {
      console.log('Places API available:', typeof (window as any).google.maps?.places !== 'undefined' ? 'yes' : 'no');
      
      // Initialize services if not already initialized
      if (!this.autocompleteService && (window as any).google?.maps?.places) {
        console.log('Creating AutocompleteService');
        this.autocompleteService = new (window as any).google.maps.places.AutocompleteService();
      }
      
      if (!this.geocoder && (window as any).google?.maps) {
        console.log('Creating Geocoder');
        this.geocoder = new (window as any).google.maps.Geocoder();
      }
    }
  }
  
  // Load Google Maps script dynamically
  private loadGoogleMapsScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    console.log('Loading Google Maps script with key:', this.API_KEY.substring(0, 5) + '...');
    this.scriptLoading = true;
    
    this.loadingPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
      
      if (existingScript) {
        console.log('Google Maps script tag already exists');
        
        if (typeof (window as any).google !== 'undefined' && 
            typeof (window as any).google.maps !== 'undefined' &&
            typeof (window as any).google.maps.places !== 'undefined') {
          this.scriptLoaded = true;
          resolve();
        } else {
          const checkGoogleExists = () => {
            if (typeof (window as any).google !== 'undefined' && 
                typeof (window as any).google.maps !== 'undefined' &&
                typeof (window as any).google.maps.places !== 'undefined') {
              this.scriptLoaded = true;
              resolve();
            } else {
              setTimeout(checkGoogleExists, 100);
            }
          };
          
          checkGoogleExists();
        }
        
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        
        // Check if places library is available
        const checkPlacesExists = () => {
          if (typeof (window as any).google !== 'undefined' && 
              typeof (window as any).google.maps !== 'undefined' &&
              typeof (window as any).google.maps.places !== 'undefined') {
            this.scriptLoaded = true;
            this.scriptLoading = false;
            resolve();
          } else {
            setTimeout(checkPlacesExists, 100);
          }
        };
        
        checkPlacesExists();
      };
      
      script.onerror = (e) => {
        console.error('Failed to load Google Maps API:', e);
        this.scriptLoading = false;
        this.loadingPromise = null;
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
      console.log('Google Maps API script tag added to document');
    });
    
    return this.loadingPromise;
  }
  
  // Get singleton instance
  public static getInstance(): GeocodingService {
    if (!GeocodingService.instance) {
      GeocodingService.instance = new GeocodingService();
    }
    return GeocodingService.instance;
  }
  
  // Ensure Google services are ready
  private async ensureServicesReady(): Promise<void> {
    if (!this.scriptLoaded) {
      await this.loadGoogleMapsScript();
      this.initGoogleServices();
    }
    
    if (!this.autocompleteService || !this.geocoder) {
      this.initGoogleServices();
    }
    
    if (!this.autocompleteService || !this.geocoder) {
      throw new Error('Google services could not be initialized');
    }
  }
  
  // Get place predictions for autocomplete
  public async getPlacePredictions(
    input: string,
    options: {
      countryRestrictions?: string[];
      types?: string[];
    } = {}
  ): Promise<PlacePrediction[]> {
    if (!input || input.length < 2) {
      return [];
    }
    
    await this.ensureServicesReady();
    
    const { countryRestrictions = ['ke'], types = ['geocode'] } = options;
    const cacheKey = `${input}-${countryRestrictions.join(',')}-${types.join(',')}`;
    
    // Check cache first
    const cachedData = this.autocompleteCache[cacheKey];
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_EXPIRY) {
      return cachedData.results;
    }
    
    if (!this.autocompleteService) {
      console.error('Google Places Autocomplete service not available even after ensuring services');
      throw new Error('Google Places Autocomplete service not available');
    }
    
    try {
      const request = {
        input,
        types,
        componentRestrictions: { country: countryRestrictions }
      };
      
      return new Promise((resolve, reject) => {
        this.autocompleteService.getPlacePredictions(
          request,
          (predictions: any, status: any) => {
            const placesStatus = (window as any).google.maps.places.PlacesServiceStatus;
            
            if (status !== placesStatus.OK || !predictions) {
              if (status === placesStatus.ZERO_RESULTS) {
                resolve([]);
              } else {
                reject(new Error(`Places Autocomplete request failed: ${status}`));
              }
              return;
            }
            
            // Cache the results
            this.autocompleteCache[cacheKey] = {
              results: predictions as PlacePrediction[],
              timestamp: Date.now()
            };
            
            resolve(predictions as PlacePrediction[]);
          }
        );
      });
    } catch (error) {
      console.error('Error getting place predictions:', error);
      throw error;
    }
  }
  
  // Debounced version of getPlacePredictions
  public debouncedGetPlacePredictions = debounce(
    async (
      input: string,
      callback: (results: PlacePrediction[]) => void,
      errorCallback: (error: Error) => void,
      options?: {
        countryRestrictions?: string[];
        types?: string[];
      }
    ) => {
      try {
        const results = await this.getPlacePredictions(input, options);
        callback(results);
      } catch (error) {
        errorCallback(error as Error);
      }
    },
    300 // 300ms debounce time (faster than Nominatim because Google has higher rate limits)
  );
  
  // Update to geocodePlaceId method in GeocodingService class

public async geocodePlaceId(placeId: string): Promise<GoogleGeocodingResult> {
    await this.ensureServicesReady();
    
    const cacheKey = placeId;
    
    // Check cache first
    const cachedData = this.geocodingCache[cacheKey];
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_EXPIRY) {
      return cachedData.result;
    }
    
    if (!this.geocoder) {
      throw new Error('Google Geocoder service not available');
    }
    
    try {
      return new Promise((resolve, reject) => {
        this.geocoder.geocode(
          { placeId },
          (results: any, status: any) => {
            const geocoderStatus = (window as any).google.maps.GeocoderStatus;
            
            if (status !== geocoderStatus.OK || !results || results.length === 0) {
              reject(new Error(`Geocoder request failed: ${status}`));
              return;
            }
            
            const result = results[0];
            
            // Ensure result has the expected structure before returning
            if (!result.geometry || 
                !result.geometry.location || 
                typeof result.geometry.location.lat !== 'function' || 
                typeof result.geometry.location.lng !== 'function') {
              console.error('Invalid geometry structure in geocode result:', result);
              
              // Try to construct a valid result
              const validResult: GoogleGeocodingResult = {
                place_id: result.place_id,
                formatted_address: result.formatted_address,
                geometry: {
                  location: {
                    lat: typeof result.geometry?.location?.lat === 'function' 
                      ? result.geometry.location.lat() 
                      : typeof result.geometry?.location?.lat === 'number'
                        ? result.geometry.location.lat
                        : 0,
                    lng: typeof result.geometry?.location?.lng === 'function'
                      ? result.geometry.location.lng()
                      : typeof result.geometry?.location?.lng === 'number'
                        ? result.geometry.location.lng
                        : 0
                  },
                  viewport: result.geometry?.viewport || {
                    northeast: { lat: 0, lng: 0 },
                    southwest: { lat: 0, lng: 0 }
                  }
                },
                address_components: result.address_components || [],
                types: result.types || []
              };
              
              // Verify we have valid coordinates
              if (validResult.geometry.location.lat === 0 && validResult.geometry.location.lng === 0) {
                reject(new Error('Invalid location coordinates in geocode result'));
                return;
              }
              
              // Cache the normalized result
              this.geocodingCache[cacheKey] = {
                result: validResult,
                timestamp: Date.now()
              };
              
              resolve(validResult);
            } else {
              // Google Maps API returns LatLng objects with lat() and lng() methods
              // We need to convert them to plain numbers for our interface
              const normalizedResult: GoogleGeocodingResult = {
                place_id: result.place_id,
                formatted_address: result.formatted_address,
                geometry: {
                  location: {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng()
                  },
                  viewport: {
                    northeast: {
                      lat: result.geometry.viewport.getNorthEast().lat(),
                      lng: result.geometry.viewport.getNorthEast().lng()
                    },
                    southwest: {
                      lat: result.geometry.viewport.getSouthWest().lat(),
                      lng: result.geometry.viewport.getSouthWest().lng()
                    }
                  }
                },
                address_components: result.address_components,
                types: result.types
              };
              
              // Cache the normalized result
              this.geocodingCache[cacheKey] = {
                result: normalizedResult,
                timestamp: Date.now()
              };
              
              resolve(normalizedResult);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error geocoding place ID:', error);
      throw error;
    }
  }
  
  // Reverse geocode coordinates to address
  public async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<GoogleGeocodingResult> {
    await this.ensureServicesReady();
    
    const cacheKey = `${lat.toFixed(6)}-${lng.toFixed(6)}`;
    
    // Check cache first
    const cachedData = this.geocodingCache[cacheKey];
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_EXPIRY) {
      return cachedData.result;
    }
    
    if (!this.geocoder) {
      throw new Error('Google Geocoder service not available');
    }
    
    try {
      const request = {
        location: { lat, lng }
      };
      
      return new Promise((resolve, reject) => {
        this.geocoder.geocode(
          request,
          (results: any, status: any) => {
            const geocoderStatus = (window as any).google.maps.GeocoderStatus;
            
            if (status !== geocoderStatus.OK || !results || results.length === 0) {
              reject(new Error(`Reverse geocoder request failed: ${status}`));
              return;
            }
            
            const result = results[0] as unknown as GoogleGeocodingResult;
            
            // Cache the result
            this.geocodingCache[cacheKey] = {
              result,
              timestamp: Date.now()
            };
            
            resolve(result);
          }
        );
      });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }
  
  // Format address components for display
  public formatAddressComponents(result: GoogleGeocodingResult): {
    formattedAddress: string;
    streetAddress?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  } {
    const components = result.address_components;
    
    const getComponent = (type: string): string | undefined => {
      const component = components.find(c => c.types.includes(type));
      return component?.long_name;
    };
    
    return {
      formattedAddress: result.formatted_address,
      streetAddress: [
        getComponent('street_number'),
        getComponent('route')
      ].filter(Boolean).join(' '),
      neighborhood: getComponent('sublocality_level_1') || getComponent('neighborhood'),
      city: getComponent('locality') || getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      postalCode: getComponent('postal_code')
    };
  }
  
  // Search for a location by text query
  public async searchLocation(query: string): Promise<{
    lat: number;
    lng: number;
    address: string;
  }> {
    const predictions = await this.getPlacePredictions(query);
    
    if (predictions.length === 0) {
      throw new Error('No locations found for this query');
    }
    
    const result = await this.geocodePlaceId(predictions[0].place_id);
    
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      address: result.formatted_address
    };
  }
  
  // Clear cache
  public clearCache(): void {
    this.autocompleteCache = {};
    this.geocodingCache = {};
  }
}

// Export singleton instance
export const googleGeocodingService = GeocodingService.getInstance();

// Export helper functions
export const getLocationFromText = async (
  query: string
): Promise<{ lat: number; lng: number; address: string }> => {
  return googleGeocodingService.searchLocation(query);
};

export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  const result = await googleGeocodingService.reverseGeocode(lat, lng);
  return result.formatted_address;
};

export default GeocodingService;
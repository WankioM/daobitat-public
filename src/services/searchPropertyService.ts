import api from './api';

export interface SearchParams {
  location?: string;
  category?: string;
  budget?: string;
  paymentMode?: string;
  propertyType?: string;
  page?: number;
  limit?: number;
}

export interface AdvancedSearchParams extends SearchParams {
  amenities?: string[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

export const searchPropertyService = {
  /**
   * Basic property search with essential filters
   */
  searchProperties: async (searchParams: SearchParams) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/properties/search?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Advanced property search with additional filters
   */
  advancedSearch: async (searchParams: AdvancedSearchParams) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await api.get(`/api/properties/advanced-search?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get location and property suggestions based on user input
   */
  getSearchSuggestions: async (query: string) => {
    if (!query || query.length < 2) {
      return { status: 'success', data: [] };
    }
    
    try {
      const response = await api.get(`/api/properties/search/suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return { status: 'error', data: [] };
    }
  },

  /**
   * Save user's search preferences
   * Requires authentication
   */
  saveSearchPreferences: async (preferences: {
    preferredLocations?: string[];
    preferredTypes?: string[];
    priceRange?: { min: number; max: number };
    preferredAmenities?: string[];
  }) => {
    try {
      const response = await api.post('/api/properties/search/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error saving search preferences:', error);
      // Return silent error to not disrupt user experience
      return { status: 'error', message: 'Failed to save preferences' };
    }
  },

  /**
   * Get saved search history
   * Requires authentication
   */
  getSearchHistory: async () => {
    try {
      const response = await api.get('/api/properties/search/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching search history:', error);
      return { status: 'error', data: [] };
    }
  },

  /**
   * Clear search history
   * Requires authentication
   */
  clearSearchHistory: async () => {
    try {
      const response = await api.delete('/api/properties/search/history');
      return response.data;
    } catch (error) {
      console.error('Error clearing search history:', error);
      return { status: 'error', message: 'Failed to clear history' };
    }
  },

  /**
   * Save current search query to history
   * Requires authentication
   */
  saveSearchQuery: async (query: any) => {
    try {
      const response = await api.post('/api/properties/search/history', { query });
      return response.data;
    } catch (error) {
      console.error('Error saving search query:', error);
      // Return silent error to not disrupt user experience
      return { status: 'error', message: 'Failed to save search' };
    }
  },

  /**
   * Get properties nearby a specific location
   */
  getNearbyProperties: async (lat: number, lng: number, radius?: number) => {
    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString()
    });
    
    if (radius) {
      queryParams.append('radius', radius.toString());
    }
    
    const response = await api.get(`/api/properties/nearby?${queryParams.toString()}`);
    return response.data;
  },
  
  /**
   * Get properties within map bounds
   */
  getPropertiesInBounds: async (north: number, south: number, east: number, west: number) => {
    const queryParams = new URLSearchParams({
      north: north.toString(),
      south: south.toString(),
      east: east.toString(),
      west: west.toString()
    });
    
    const response = await api.get(`/api/properties/bounds?${queryParams.toString()}`);
    return response.data;
  },
  
  /**
   * Search properties near a location name
   */
  searchNearLocation: async (location: string, distance?: number) => {
    const queryParams = new URLSearchParams({
      location: location
    });
    
    if (distance) {
      queryParams.append('distance', distance.toString());
    }
    
    const response = await api.get(`/api/properties/location?${queryParams.toString()}`);
    return response.data;
  },
  
  /**
   * Get property clusters for map view
   */
  getPropertyClusters: async (zoom: number) => {
    const response = await api.get(`/api/properties/clusters?zoom=${zoom}`);
    return response.data;
  },

  /**
   * Get latest properties
   */
  getLatestProperties: async (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/api/properties/latest${params}`);
    return response.data;
  },

  /**
   * Get trending properties
   */
  getTrendingProperties: async (limit?: number, skip?: number) => {
    const queryParams = new URLSearchParams();
    
    if (limit) queryParams.append('limit', limit.toString());
    if (skip) queryParams.append('skip', skip.toString());
    
    const params = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/api/properties/trending${params}`);
    return response.data;
  },

  /**
   * Get featured properties
   */
  getFeaturedProperties: async (priorityLevel?: number) => {
    const params = priorityLevel ? `?priorityLevel=${priorityLevel}` : '';
    const response = await api.get(`/api/properties/featured${params}`);
    return response.data;
  },

  /**
   * Get featured properties by category
   */
  getFeaturedByCategory: async (category: 'top' | 'trending' | 'recommended') => {
    const response = await api.get(`/api/properties/featured/${category}`);
    return response.data;
  }
};
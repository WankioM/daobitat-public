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
   * Get property suggestions based on user's search history or preferences
   */
  getSearchSuggestions: async (query: string) => {
    const response = await api.get(`/api/properties/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  /**
   * Save user's search preferences
   */
  saveSearchPreferences: async (preferences: {
    preferredLocations?: string[];
    preferredTypes?: string[];
    priceRange?: { min: number; max: number };
    preferredAmenities?: string[];
  }) => {
    const response = await api.post('/api/properties/search/preferences', preferences);
    return response.data;
  },

  /**
   * Get saved search history
   */
  getSearchHistory: async () => {
    const response = await api.get('/api/properties/search/history');
    return response.data;
  },

  /**
   * Clear search history
   */
  clearSearchHistory: async () => {
    const response = await api.delete('/api/properties/search/history');
    return response.data;
  }
};

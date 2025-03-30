import api from './api';
import { uploadImageToGCS } from './imageUpload';

// Type definitions for better type safety
interface Coordinates {
  lat: number;
  lng: number;
}

interface PropertyStatus {
  sold: boolean;
  occupied: boolean;
  listingState: 'simply listed' | 'requested financing' | 'in marketplace waiting for financing' | 'accepted for collateral';
}

interface Amenities {
  furnished: boolean;
  pool: boolean;
  gym: boolean;
  garden: boolean;
  parking: boolean;
}

interface ImageUploadResponse {
  data: {
    signedUrl: string;
    fileUrl: string;
    fileName: string;
  };
}

interface PropertyData {
  propertyName: string;
  location: string;
  coordinates?: Coordinates;
  streetAddress: string;
  googleMapsURL?: string;
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Special-purpose' | 'Vacation/Short-term rentals';
  specificType: string;
  unitNo?: string;
  action: string;
  price: number;
  space: number;
  bedrooms?: number;
  bathrooms?: number;
  features?: string[];
  security?: string;
  amenities?: Amenities;
  additionalComments?: string;
  rooms?: number;
  cryptoAccepted?: boolean;
  images?: string[];
  termsAccepted?: boolean;
}

interface CoOwnershipData {
  coOwned: boolean;
  availableShares?: number;
  coOwners?: Array<{
    userId: string;
    percentageOwned: number;
    investmentDate?: Date;
  }>;
}

interface TransactionData {
  txId: string;
  buyerId: string;
  amount: number;
  paymentMethod: string;
}

interface BookingAction {
  action: 'add' | 'update' | 'delete';
  bookingId?: string;
  renterId?: string;
  checkIn?: string;
  checkOut?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface ProposalAction {
  action: 'create' | 'vote' | 'update-status' | 'delete';
  proposalId?: string;
  title?: string;
  description?: string;
  expiryDays?: number;
  vote?: 'yes' | 'no' | 'abstain';
  status?: 'proposed' | 'voting' | 'approved' | 'rejected' | 'implemented';
}

interface SearchParams {
  location?: string;
  category?: string;
  budget?: string;
  paymentMode?: string;
  propertyType?: string;
  page?: number;
  limit?: number;
}

interface AdvancedSearchParams extends SearchParams {
  amenities?: string[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

// Main property service object
export const propertyService = {
  // Core property management
  createProperty: async (propertyData: PropertyData) => {
    // Validate required fields
    const requiredFields = [
      'propertyName',
      'location',
      'streetAddress',
      'propertyType',
      'specificType',
      'action',
      'price',
      'space'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = propertyData[field as keyof PropertyData];
      return !value || (typeof value === 'string' && value === '');
    });
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const defaultedData = {
      ...propertyData,
      status: {
        sold: false,
        occupied: false,
        listingState: 'simply listed' as const
      },
      specificType: propertyData.specificType || 'default',
      action: propertyData.action || 'sale',
      security: propertyData.security || 'none',
      space: propertyData.space || 0,
      features: propertyData.features || []
    };

    // Process images if present - use processBatchPropertyImages to handle them
    if (propertyData.images?.length) {
      try {
        const processedImages = await propertyService.processBatchPropertyImages(propertyData.images);
        
        // Update the property data with successfully uploaded images
        defaultedData.images = processedImages;
      } catch (error) {
        console.error('Failed to process images:', error);
        // Continue with property creation even if all images fail
        defaultedData.images = [];
      }
    }

    const response = await api.post('/api/properties', {
      ...defaultedData,
      status: {
        sold: false,
        occupied: false,
        listingState: 'simply listed'
      },
      // Ensure propertyType is one of the allowed values
      propertyType: defaultedData.propertyType || 'Residential',
      // Remove fields not in the model
      termsAccepted: undefined
    });
    return response.data;
  },

  updateProperty: async (propertyId: string, propertyData: Partial<PropertyData>) => {
    const response = await api.patch(`/api/properties/${propertyId}`, propertyData);
    return response.data;
  },

  deleteProperty: async (propertyId: string) => {
    const response = await api.delete(`/api/properties/${propertyId}`);
    return response.data;
  },

  getPropertyById: async (propertyId: string) => {
    return api.get(`/api/properties/${propertyId}`);
  },

  getUserProperties: () => {
    return api.get('/api/properties/user/my-properties');
  },

  // Property Images
  getPropertyImages: async (fileName: string, fileType: string) => {
    const response = await api.post('/api/properties/images/signed-url', { fileName, fileType });
    return response.data;
  },

  // Simplified uploadPropertyImage method
  uploadPropertyImage: async (imageUrl: string): Promise<string | null> => {
    try {
      if (!imageUrl.startsWith('blob:')) {
        // Already a remote URL, just return it
        return imageUrl;
      }
      
      console.log('Processing blob URL for upload');
      
      // Fetch the blob data
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Upload using the uploadImageToGCS function from imageUpload.ts
      const cloudUrl = await uploadImageToGCS(blob);
      
      console.log('Image uploaded successfully to GCS:', cloudUrl);
      return cloudUrl;
    } catch (error) {
      console.error('Error in uploadPropertyImage:', error);
      return null; // Return null on failure - no local fallbacks
    }
  },

  // Simplified batch processing
  processBatchPropertyImages: async (images: string[]): Promise<string[]> => {
    if (!images?.length) {
      return [];
    }
    
    try {
      const uploadedImages: string[] = [];
      
      // Process at most 3 images at a time to prevent overwhelming the server
      const imageBatches: string[][] = [];
      for (let i = 0; i < images.length; i += 3) {
        imageBatches.push(images.slice(i, i + 3));
      }
      
      for (const batch of imageBatches) {
        console.log(`Processing batch of ${batch.length} images...`);
        
        // Process each batch in parallel
        const batchResults = await Promise.all(
          batch.map(async (imageUrl) => {
            try {
              // Skip already uploaded images
              if (!imageUrl.startsWith('blob:')) {
                return imageUrl;
              }
              
              // Try to upload the image
              return await propertyService.uploadPropertyImage(imageUrl);
            } catch (err) {
              console.error(`Error uploading image:`, err);
              return null;
            }
          })
        );
        
        // Add only successful uploads to the results (filter out nulls)
        uploadedImages.push(...batchResults.filter(url => url !== null) as string[]);
        
        // Wait a bit between batches to avoid overloading the server
        if (imageBatches.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      return uploadedImages;
    } catch (error) {
      console.error('Error processing property images:', error);
      return [];
    }
  },

  makePropertyImagePublic: async (fileName: string) => {
    const response = await api.post('/api/properties/images/public', { fileName });
    return response.data;
  },

  // Property Engagement
  incrementPropertyClicks: async (propertyId: string) => {
    const response = await api.post(`/api/properties/${propertyId}/click`);
    return response.data;
  },

  updateWishlist: async (propertyId: string, action: 'add' | 'remove') => {
    try {
      const response = await api.post(`/api/properties/${propertyId}/wishlist`, { action });
      return response.data;
    } catch (error) {
      console.error('Error updating wishlist:', error);
      throw error;
    }
  },

  // Property Listings
  getLatestProperties: async () => {
    const response = await api.get('/api/properties/latest');
    return response.data;
  },

  getTrendingProperties: async (limit: number = 50, skip: number = 0) => {
    const response = await api.get('/api/properties/trending', {
      params: {
        limit,
        skip,
        sort: '-popularityScore' // Sort by popularity score in descending order
      }
    });
    return response.data;
  },
  
  // Featured Properties
  getFeaturedProperties: async (priorityLevel?: number) => {
    const query = priorityLevel ? `?priorityLevel=${priorityLevel}` : '';
    const response = await api.get(`/api/properties/featured${query}`);
    return response.data;
  },

  getFeaturedByCategory: async (category: 'top' | 'trending' | 'recommended') => {
    const response = await api.get(`/api/properties/featured/${category}`);
    return response.data;
  },

  // Co-ownership Features
  updateCoOwnership: async (propertyId: string, data: CoOwnershipData) => {
    const response = await api.put(`/api/properties/${propertyId}/co-ownership`, data);
    return response.data;
  },

  getCoOwnershipStats: async (propertyId: string) => {
    const response = await api.get(`/api/properties/${propertyId}/co-ownership/stats`);
    return response.data;
  },

  addPropertyTransaction: async (propertyId: string, transactionData: TransactionData) => {
    const response = await api.post(`/api/properties/${propertyId}/transactions`, transactionData);
    return response.data;
  },

  // Booking Management
  managePropertyBooking: async (propertyId: string, bookingAction: BookingAction) => {
    const response = await api.post(`/api/properties/${propertyId}/bookings`, bookingAction);
    return response.data;
  },

  // Proposal Management
  managePropertyProposal: async (propertyId: string, proposalAction: ProposalAction) => {
    const response = await api.post(`/api/properties/${propertyId}/proposals`, proposalAction);
    return response.data;
  },

  // Geospatial Features
  getNearbyProperties: async (lat: number, lng: number, radius?: number) => {
    const response = await api.get('/api/properties/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  },

  getPropertiesInBounds: async (north: number, south: number, east: number, west: number) => {
    const response = await api.get('/api/properties/bounds', {
      params: { north, south, east, west }
    });
    return response.data;
  },

  searchNearLocation: async (location: string, distance?: number) => {
    const response = await api.get('/api/properties/location', {
      params: { location, distance }
    });
    return response.data;
  },

  getPropertyClusters: async (zoom: number) => {
    const response = await api.get('/api/properties/clusters', {
      params: { zoom }
    });
    return response.data;
  },

  // Search Functionality
  searchProperties: async (params: SearchParams) => {
    const response = await api.get('/api/properties/search', { params });
    return response.data;
  },

  advancedSearch: async (params: AdvancedSearchParams) => {
    const response = await api.get('/api/properties/advanced-search', { params });
    return response.data;
  },

  // Kept for compatibility but simplified
  uploadSinglePropertyImage: async (imageUrl: string): Promise<string | null> => {
    // Just call the standard uploadPropertyImage method
    return propertyService.uploadPropertyImage(imageUrl);
  }
};
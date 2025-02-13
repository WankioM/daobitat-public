import api from './api';

interface ImageUploadResponse {
  data: {
    url: string;
  };
}

export const propertyService = {
  createProperty: async (propertyData: any) => {
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

    const missingFields = requiredFields.filter(field => !propertyData[field] || propertyData[field] === '');
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

    if (propertyData.images?.length) {
      const uploadedImages = await Promise.all(
        propertyData.images.map(async (imageUrl: string) => {
          if (imageUrl.startsWith('blob:')) {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // Get signed URL for upload
            const { data } = await api.post('/api/properties/images/signed-url', {
              fileName: blob.name || 'image.jpg',
              fileType: blob.type
            });

            console.log('Received data:', data);
            
            if (!data.data.signedUrl) {
              throw new Error('No signed URL received from server');
            }

            // Upload to Google Cloud Storage using signed URL
            const uploadResponse = await fetch(data.data.signedUrl, {
              method: 'PUT',
              body: blob,
              headers: {
                'Content-Type': blob.type
              },
              mode: 'cors'
            });

            if (!uploadResponse.ok) {
              throw new Error(`Failed to upload to GCS: ${uploadResponse.statusText}`);
            }

            console.log('Successfully uploaded to GCS, making public...');

            // Make the image public
            const publicResponse = await api.post('/api/properties/images/public', {
              fileName: data.data.fileName
            });

            if (publicResponse.data?.status !== 'success') {
              throw new Error('Failed to make image public');
            }

            // Return the public URL
            return data.data.fileUrl;
          }
          return imageUrl;
        })
      );
      defaultedData.images = uploadedImages;
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

  updateProperty: async (propertyId: string, propertyData: any) => {
    const response = await api.patch(`/api/properties/${propertyId}`, propertyData);
    return response.data;
  },

  deleteProperty: async (propertyId: string) => {
    const response = await api.delete(`/api/properties/${propertyId}`);
    return response.data;
  },

  getPropertyImages: async (fileName: string, fileType: string) => {
    const response = await api.post('/api/properties/images', { fileName, fileType });
    return response.data;
  },

  makePropertyImagePublic: async (fileName: string) => {
    const response = await api.post('/api/properties/images/public', { fileName });
    return response.data;
  },

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

  getUserProperties() {
    return api.get('/api/properties/user');
  },

  getPropertyById: async (propertyId: string) => {
    return api.get(`/api/properties/${propertyId}`);
  },

  searchProperties: async (searchParams: {
    location?: string;
    category?: string;
    budget?: string;
    paymentMode?: string;
    propertyType?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Add search parameters to query string
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.category) queryParams.append('category', searchParams.category);
    if (searchParams.budget) queryParams.append('budget', searchParams.budget);
    if (searchParams.paymentMode) queryParams.append('paymentMode', searchParams.paymentMode);
    if (searchParams.propertyType) queryParams.append('propertyType', searchParams.propertyType);
    if (searchParams.page) queryParams.append('page', searchParams.page.toString());
    if (searchParams.limit) queryParams.append('limit', searchParams.limit.toString());

    return api.get(`/api/properties/search?${queryParams.toString()}`);
  },

  advancedSearch: async (searchParams: {
    location?: string;
    category?: string;
    budget?: string;
    paymentMode?: string;
    propertyType?: string;
    amenities?: string[];
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minArea?: number;
    maxArea?: number;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    
    // Add all search parameters to query string
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return api.get(`/api/properties/advanced-search?${queryParams.toString()}`);
  }
};
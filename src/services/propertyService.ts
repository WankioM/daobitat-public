import api from './api';

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

    // In propertyService.ts

    if (propertyData.images?.length) {
      try {
        // Process each image one at a time to avoid overwhelming the server
        const uploadedImages = [];
        
        for (const imageUrl of propertyData.images) {
          try {
            // Skip already uploaded images (ones that aren't blob URLs)
            if (!imageUrl.startsWith('blob:')) {
              uploadedImages.push(imageUrl);
              continue;
            }
            
            // Fetch the blob data
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            
            // Generate a unique filename
            const timestamp = Date.now();
            const randomSuffix = Math.floor(Math.random() * 10000);
            const extension = blob.type.split('/')[1] || 'jpg';
            const fileName = `propertyimages/${timestamp}-${randomSuffix}.${extension}`;
            
            console.log(`Processing image: ${fileName}`);
            
            // Get signed URL - with retry mechanism
            const MAX_RETRIES = 3;
            let retryCount = 0;
            let uploadUrl = null;
            let fileUrl = null;
            
            while (retryCount < MAX_RETRIES && !uploadUrl) {
              try {
                const { data } = await api.post('/api/upload-url', {
                  fileName,
                  fileType: blob.type
                });
                
                if (data && data.data) {
                  uploadUrl = data.data.signedUrl;
                  fileUrl = data.data.fileUrl;
                  console.log(`Got signed URL on attempt ${retryCount + 1}`);
                } else {
                  throw new Error('Invalid response format from upload-url endpoint');
                }
              } catch (urlError) {
                retryCount++;
                console.error(`Failed to get signed URL (attempt ${retryCount}):`, urlError);
                if (retryCount >= MAX_RETRIES) throw urlError;
                await new Promise(r => setTimeout(r, 1000 * retryCount)); // Exponential backoff
              }
            }
            
            if (!uploadUrl || !fileUrl) {
              throw new Error('Failed to get upload URL after multiple attempts');
            }
            
            // Upload the file with retry mechanism
            retryCount = 0;
            let uploadSuccess = false;
            
            while (retryCount < MAX_RETRIES && !uploadSuccess) {
              try {
                const uploadResponse = await fetch(uploadUrl, {
                  method: 'PUT',
                  body: blob,
                  headers: { 'Content-Type': blob.type }
                });
                
                if (uploadResponse.ok) {
                  uploadSuccess = true;
                  console.log(`Uploaded file successfully on attempt ${retryCount + 1}`);
                } else {
                  throw new Error(`Upload failed with status: ${uploadResponse.status}`);
                }
              } catch (uploadError) {
                retryCount++;
                console.error(`Upload attempt ${retryCount} failed:`, uploadError);
                if (retryCount >= MAX_RETRIES) throw uploadError;
                await new Promise(r => setTimeout(r, 1000 * retryCount)); // Exponential backoff
              }
            }
            
            // Try to make file public - but don't fail if this doesn't work
            try {
              await api.post('/api/make-public', { fileName });
              console.log(`Made file public: ${fileName}`);
            } catch (publicError) {
              console.warn('Could not make file public, using signed URL instead:', publicError);
              // Continue anyway - we'll use the signed URL
            }
            
            // Use a public URL format which should work if the file was made public
            const publicUrl = `https://storage.googleapis.com/web-vids/${fileName}`;
            
            // Add the best available URL to our results
            uploadedImages.push(fileUrl || publicUrl);
            
          } catch (singleImageError) {
            console.error('Failed to process individual image:', singleImageError);
            // Skip this image but continue processing others
          }
        }
        
        // Update the property data with successfully uploaded images
        if (uploadedImages.length > 0) {
          defaultedData.images = uploadedImages;
        } else {
          defaultedData.images = [];
        }
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

  // Update existing uploadPropertyImage method
// Update this in propertyService.ts
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
    
    // Generate a unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const extension = blob.type.split('/')[1] || 'jpg';
    const fileName = `propertyimages/${timestamp}-${randomSuffix}.${extension}`;
    
    console.log(`Attempting to upload image as: ${fileName}`);
    
    // Get a signed URL
    const uploadUrlResponse = await api.post('/api/upload-url', {
      fileName,
      fileType: blob.type
    });
    
    console.log('Got upload URL response:', uploadUrlResponse.status);
    
    const signedUrl = uploadUrlResponse.data.data.signedUrl;
    const fileUrl = uploadUrlResponse.data.data.fileUrl || uploadUrlResponse.data.data.publicUrl;
    
    console.log('Proceeding with upload to signed URL');
    
    // Upload the image
    const uploadResult = await fetch(signedUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': blob.type }
    });
    
    if (!uploadResult.ok) {
      throw new Error(`Upload failed with status: ${uploadResult.status}`);
    }
    
    console.log('Image uploaded successfully to GCS');
    
    // Try to make the file public
    try {
      await api.post('/api/make-public', { fileName });
      console.log('File made public successfully');
    } catch (publicError) {
      console.warn('Could not make file public, using signed URL');
      // Continue anyway
    }

    // Use the URL provided by the API response
    console.log('Using URL:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error in uploadPropertyImage:', error);
    
    // In a real failure, return the original blob URL as fallback
    // This at least lets users see their images locally
    return imageUrl;
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
  uploadSinglePropertyImage: async (imageUrl: string): Promise<string | null> => {
    try {
      if (!imageUrl.startsWith('blob:')) {
        // Already a remote URL, just return it
        return imageUrl;
      }
      
      // Fetch the blob data
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Generate a unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 10000);
      const extension = blob.type.split('/')[1] || 'jpg';
      const fileName = `propertyimages/${timestamp}-${randomSuffix}.${extension}`;
      
      console.log(`Uploading image: ${fileName}`);
      
      // SIMPLE DIRECT APPROACH - minimize potential points of failure
      try {
        // Step 1: Get a signed URL (simplest request possible)
        const uploadUrlResponse = await api.post('/api/upload-url', {
          fileName,
          fileType: blob.type
        });
        
        const signedUrl = uploadUrlResponse.data.data.signedUrl;
        const fileUrl = uploadUrlResponse.data.data.publicUrl || uploadUrlResponse.data.data.fileUrl;
        
        // Step 2: Upload the image directly
        const uploadResult = await fetch(signedUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': blob.type }
        });
        
        if (!uploadResult.ok) {
          throw new Error(`Upload failed with status: ${uploadResult.status}`);
        }
        
        console.log('Image uploaded successfully');
        
        // Step 3: Explicitly make the file public to ensure it's accessible
        try {
          await api.post('/api/make-public', { fileName });
          console.log('Image made public successfully');
        } catch (publicError) {
          console.warn('Could not make file public, using signed URL instead:', publicError);
          // Continue anyway - we'll use the URL we already have
        }
        
        return fileUrl;
      } catch (error) {
        console.error('Failed to upload image:', error);
        // In this case, return null instead of a local URL
        // so that the property creation knows this image failed
        return null;
      }
    } catch (error) {
      console.error('Error in uploadPropertyImage:', error);
      return null;
    }
  },
  
  processBatchPropertyImages:  async (images: string[]): Promise<string[]> => {
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
            // Try up to 2 times for each image
            for (let attempt = 1; attempt <= 2; attempt++) {
              try {
                const result = await propertyService.uploadPropertyImage(imageUrl);
                if (result) return result;
                console.log(`Attempt ${attempt} failed, ${attempt < 2 ? 'retrying...' : 'giving up'}`);
              } catch (err) {
                console.error(`Error in attempt ${attempt}:`, err);
              }
            }
            return null; // Return null if all attempts failed
          })
        );
        
        // Add successful uploads to the results
        for (const url of batchResults) {
          if (url) uploadedImages.push(url);
        }
        
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
  }
};
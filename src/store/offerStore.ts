// src/store/offerStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { offerService } from '../services/offerService';
import { Offer, CounterOfferDTO, PaymentUpdateDTO } from '../types/offers';
import { idToString } from '../types/common';
import { PaymentStatus, PaymentType } from '../types/offerstatusenums';
import { adaptCounterOfferForService, adaptPaymentUpdateForService } from '../utils/offerTypeAdapters';

// Define action types for better type safety
export type OfferAction = 
  | 'accept'
  | 'accept-counter'
  | 'confirm'
  | 'reject'
  | 'withdraw'
  | 'counter'
  | 'payment-complete'
  | 'request-confirmation';

interface OfferState {
  activeOffers: Record<string, Offer>;
  socket: Socket | null;
  isConnected: boolean;
  processing: boolean;
  error: string | null;
  
  // Actions
  initializeSocket: () => void;
  updateOffer: (offerId: string, offerData: Partial<Offer>) => void;
  storeHandleOfferAction: (offerId: string, action: OfferAction, data?: any) => Promise<Offer>;
  disconnectSocket: () => void;
  getOfferById: (offerId: string) => Offer | null;
  loadOffer: (offerId: string) => Promise<Offer>;
  loadUserOffers: () => Promise<Offer[]>;
  loadPropertyOffers: (propertyId: string) => Promise<Offer[]>;
  clearOffers: () => void;
  clearError: () => void;
}

/**
 * Adapts the service Offer type to match our application Offer type
 * This ensures all required fields exist and are properly formatted
 */
function adaptServiceOffer(offer: any): Offer {
  if (!offer) {
    console.error('adaptServiceOffer received null or undefined offer');
    return offer;
  }

  console.log('adaptServiceOffer - Original offer:', JSON.stringify({
    _id: offer._id,
    property: typeof offer.property === 'object' ? offer.property._id : offer.property
  }, null, 2));

  // Create a deep copy to avoid mutation issues
  const adaptedOffer = { ...offer };
  
  // Ensure property.images is always an array if property is an object
  if (adaptedOffer.property && typeof adaptedOffer.property === 'object' && !Array.isArray(adaptedOffer.property)) {
    adaptedOffer.property = { 
      ...adaptedOffer.property,
      images: adaptedOffer.property.images || [] 
    };
  }

  // Make sure all required date fields are properly formatted
  if (typeof adaptedOffer.expiry === 'undefined') {
    adaptedOffer.expiry = adaptedOffer.responseDeadline || new Date();
  }

  // Ensure the payment history array exists
  if (adaptedOffer.payment && !Array.isArray(adaptedOffer.payment.history)) {
    adaptedOffer.payment.history = [];
  }

  console.log('adaptServiceOffer - Adapted offer ID:', adaptedOffer._id, 
    'type:', typeof adaptedOffer._id,
    'stringified:', JSON.stringify(adaptedOffer._id));

  return adaptedOffer as Offer;
}

/**
 * Function to safely adapt an array of offers
 */
function adaptServiceOfferArray(offers: any[]): Offer[] {
  return offers.map(offer => adaptServiceOffer(offer));
}

const useOfferStore = create<OfferState>((set, get) => ({
  activeOffers: {},
  socket: null,
  isConnected: false,
  processing: false,
  error: null,
  
  initializeSocket: () => {
    // Only initialize if not already connected
    if (get().socket && get().isConnected) return;
    
    try {
      // Connect to the WebSocket server
      const socket = io('/offers', {
        transports: ['websocket'],
        autoConnect: true,
      });
      
      socket.on('connect', () => {
        console.log('WebSocket connected for offers');
        set({ isConnected: true });
      });
      
      socket.on('disconnect', () => {
        console.log('WebSocket disconnected for offers');
        set({ isConnected: false });
      });
      
      socket.on('offer:update', (updatedOffer: any) => {
        console.log('Received offer update via WebSocket:', updatedOffer);
        
        // Get the offer ID as string using our helper function
        const offerId = idToString(updatedOffer._id);
        console.log('WebSocket update - Converted offer ID:', offerId);
        
        set((state) => ({
          activeOffers: {
            ...state.activeOffers,
            [offerId]: adaptServiceOffer(updatedOffer)
          }
        }));
      });
      
      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        set({ error: 'Connection to real-time updates failed. Please refresh the page.' });
      });
      
      set({ socket });
    } catch (error) {
      console.error('Error initializing WebSocket connection:', error);
      set({ error: 'Failed to initialize real-time updates' });
    }
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
  
  updateOffer: (offerId: string, offerData: Partial<Offer>) => {
    console.log('updateOffer - Updating offer with ID:', offerId);
    
    set((state) => ({
      activeOffers: {
        ...state.activeOffers,
        [offerId]: {
          ...state.activeOffers[offerId],
          ...offerData
        }
      }
    }));
    
    // Emit update via socket if available
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('offer:client-update', { offerId, data: offerData });
    }
  },
  
  storeHandleOfferAction: async (offerId: string, action: OfferAction, data?: any) => {
    // Set processing state and clear previous errors
    set({ processing: true, error: null });
    let response: any;
    
    console.log(`storeHandleOfferAction - Starting action "${action}" for offer ID:`, offerId);
    console.log('Original offer ID format:', offerId, 'type:', typeof offerId);
    
    try {
      switch(action) {
        
        case 'accept':
          console.log('Accepting offer:', offerId);
          response = await offerService.acceptOffer(offerId);
          break;
          
        case 'accept-counter':
          console.log('Accepting counter-offer:', offerId);
          response = await offerService.acceptCounterOffer(offerId);
          break;
          
        case 'confirm':
          console.log('Confirming acceptance:', offerId);
          response = await offerService.confirmAcceptance(offerId);
          break;
          
        case 'reject':
          console.log('Rejecting offer:', offerId);
          response = await offerService.rejectOffer(offerId);
          break;
          
        case 'withdraw':
          console.log('Withdrawing offer:', offerId);
          response = await offerService.withdrawOffer(offerId);
          break;
          
        case 'counter':
          console.log('Creating counter offer:', offerId);
          // Convert using adapter
          const counterOfferData = adaptCounterOfferForService(data as CounterOfferDTO);
          response = await offerService.createCounterOffer(offerId, counterOfferData);
          break;
          
        case 'payment-complete':
          console.log('Completing payment for offer:', offerId);
          // Create payment update DTO
          const paymentUpdateDTO: PaymentUpdateDTO = {
            paymentStatus: PaymentStatus.COMPLETED,
            paymentType: PaymentType.DEPOSIT,
            transactionHash: data?.transactionHash || ''
          };
          // Convert using adapter
          const servicePaymentUpdate = adaptPaymentUpdateForService(paymentUpdateDTO);
          response = await offerService.updatePaymentStatus(offerId, servicePaymentUpdate);
          break;
          
        case 'request-confirmation':
          console.log('Requesting owner confirmation for offer:', offerId);
          response = await offerService.requestOwnerConfirmation(offerId);
          break;
          
        default:
          const exhaustiveCheck: never = action;
          throw new Error(`Unhandled action type: ${action}`);
      }
      
      console.log(`Action ${action} response:`, response);
      console.log('Response offer ID format:', response._id, 'type:', typeof response._id);
      
      // Get the offer ID as string
      const responseId = idToString(response._id);
      console.log('Converted response ID:', responseId);
      
      // Update local state with the response
      set((state) => ({
        activeOffers: {
          ...state.activeOffers,
          [responseId]: adaptServiceOffer(response)
        },
        processing: false,
        error: null
      }));
      
      return adaptServiceOffer(response);
    } catch (error: any) {
      console.error(`Error performing action ${action} on offer ${offerId}:`, error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      
      set({ 
        processing: false,
        error: error.message || `Failed to perform ${action} action`
      });
      
      // Add additional error handling - try to refresh the offer data
      try {
        console.log('Attempting to refresh offer data after error');
        const refreshedOffer = await offerService.getOfferById(offerId);
        
        // Get the offer ID as string
        const refreshedId = idToString(refreshedOffer._id);
        console.log('Successfully refreshed offer with ID:', refreshedId);
        
        set((state) => ({
          activeOffers: {
            ...state.activeOffers,
            [refreshedId]: adaptServiceOffer(refreshedOffer)
          }
        }));
      } catch (refreshError) {
        console.error('Failed to refresh offer after error:', refreshError);
      }
      
      throw error;
    }
  },
  
  getOfferById: (offerId: string) => {
    console.log('getOfferById - Looking for offer with ID:', offerId);
    console.log('Available offer IDs in store:', Object.keys(get().activeOffers));
    
    const offer = get().activeOffers[offerId];
    
    if (!offer) {
      console.warn(`getOfferById - Offer with ID ${offerId} not found in store`);
      return null;
    }
    
    console.log('getOfferById - Found offer:', offer._id);
    return offer;
  },
  
  loadOffer: async (offerId: string) => {
    set({ error: null });
    console.log('loadOffer - Starting to fetch offer with ID:', offerId);
    
    try {
      const offer = await offerService.getOfferById(offerId);
      console.log('loadOffer - Service response:', offer);
      console.log('loadOffer - Offer ID in response:', offer._id, 'type:', typeof offer._id);
      
      // Get the offer ID as string
      const responseId = idToString(offer._id);
      console.log('loadOffer - Converted ID:', responseId);
      
      // Adapt the offer to our application's type
      const adaptedOffer = adaptServiceOffer(offer);
      console.log('loadOffer - Adapted offer ID:', adaptedOffer._id);
      
      set(state => ({
        activeOffers: {
          ...state.activeOffers,
          [responseId]: adaptedOffer
        }
      }));
      
      return adaptedOffer;
    } catch (error: any) {
      console.error(`Error loading offer ${offerId}:`, error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      
      set({ error: error.message || 'Failed to load offer' });
      throw error;
    }
  },
  
  loadUserOffers: async () => {
    set({ error: null });
    console.log('loadUserOffers - Starting to fetch user offers');
    
    try {
      const offers = await offerService.getUserOffers();
      console.log('loadUserOffers - Received offers count:', offers.length);
      
      // Create a map from the array of offers
      const offersMap: Record<string, Offer> = {};
      offers.forEach(offer => {
        const offerId = idToString(offer._id);
        console.log('loadUserOffers - Processing offer ID:', offerId);
        offersMap[offerId] = adaptServiceOffer(offer);
      });
      
      console.log('loadUserOffers - Offer IDs in map:', Object.keys(offersMap));
      set({ activeOffers: offersMap });
      return adaptServiceOfferArray(offers);
    } catch (error: any) {
      console.error('Error loading user offers:', error);
      set({ error: error.message || 'Failed to load your offers' });
      throw error;
    }
  },
  
  loadPropertyOffers: async (propertyId: string) => {
    set({ error: null });
    console.log('loadPropertyOffers - Starting to fetch offers for property:', propertyId);
    
    try {
      const offers = await offerService.getPropertyOffers(propertyId);
      console.log('loadPropertyOffers - Received offers count:', offers.length);
      
      // Update the store with the fetched offers
      const updatedOffers = { ...get().activeOffers };
      offers.forEach(offer => {
        const offerId = idToString(offer._id);
        console.log('loadPropertyOffers - Processing offer ID:', offerId);
        updatedOffers[offerId] = adaptServiceOffer(offer);
      });
      
      set({ activeOffers: updatedOffers });
      return adaptServiceOfferArray(offers);
    } catch (error: any) {
      console.error(`Error loading property offers for ${propertyId}:`, error);
      set({ error: error.message || 'Failed to load property offers' });
      throw error;
    }
  },
  
  clearOffers: () => {
    console.log('clearOffers - Clearing all offers from store');
    set({ activeOffers: {} });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

// Export as both default and named export for backward compatibility
export default useOfferStore;
export { useOfferStore };
// src/store/navigationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  // Track previous pages visited
  history: string[];
  // Track current active tab/section
  activeTab: string;
  // For properties list, track current page, filters, and scroll position
  propertyListState: {
    page: number;
    filters: Record<string, any>;
    scrollPosition: number;
  };
  // For offers, track which offer was last viewed
  lastViewedOfferId: string | null;
  // Methods to update state
  addToHistory: (path: string) => void;
  setActiveTab: (tab: string) => void;
  updatePropertyListState: (state: Partial<NavigationState['propertyListState']>) => void;
  setLastViewedOffer: (offerId: string) => void;
  clearHistory: () => void;
}

// Create the store with persistence
export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      // Initial state
      history: [],
      activeTab: 'Home',
      propertyListState: {
        page: 1,
        filters: {},
        scrollPosition: 0,
      },
      lastViewedOfferId: null,

      // Actions
      addToHistory: (path: string) =>
        set((state) => ({
          history: [...state.history.slice(-9), path], // Keep last 10 pages
        })),

      setActiveTab: (tab: string) =>
        set({
          activeTab: tab,
        }),

      updatePropertyListState: (newState: Partial<NavigationState['propertyListState']>) =>
        set((state) => ({
          propertyListState: {
            ...state.propertyListState,
            ...newState,
          },
        })),

      setLastViewedOffer: (offerId: string) =>
        set({
          lastViewedOfferId: offerId,
        }),

      navigateToOffer: (offerId: string) =>
        set({
          lastViewedOfferId: offerId,
          activeTab: 'Offers' 
        }),

      clearHistory: () =>
        set({
          history: [],
        }),
    }),
    {
      name: 'daobitat-navigation-storage', // localStorage key
      // We can exclude certain fields from persistence if needed
      partialize: (state) => ({
        activeTab: state.activeTab,
        propertyListState: state.propertyListState,
        lastViewedOfferId: state.lastViewedOfferId,
        // Exclude history if you don't want to persist it
      }),
    }
  )
);

export default useNavigationStore;
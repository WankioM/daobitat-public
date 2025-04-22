// src/hooks/useNavigationTracker.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigationStore from '../store/navigationStore';

/**
 * A hook to track navigation across the app
 * Use this in your App component or any layout wrapper
 */
const useNavigationTracker = () => {
  const location = useLocation();
  const { addToHistory } = useNavigationStore();

  // Track location changes in history
  useEffect(() => {
    addToHistory(location.pathname);
  }, [location.pathname, addToHistory]);
};

/**
 * A hook to restore previous application state when returning to a page
 * @param key Optional key to identify the specific component state to restore
 */
export const useRestorePreviousState = (key?: string) => {
  const { propertyListState, lastViewedOfferId } = useNavigationStore();
  
  // Return the appropriate state based on the key
  switch(key) {
    case 'properties':
      return propertyListState;
    case 'offers':
      return { lastViewedOfferId };
    default:
      return { propertyListState, lastViewedOfferId };
  }
};

/**
 * A hook to save scroll position of a specific component
 * @param elementRef React ref object for the scrollable element
 * @param dependencies Array of dependencies that trigger scroll position saving
 */
export const useSaveScrollPosition = (
  elementRef: React.RefObject<HTMLElement>,
  dependencies: any[] = []
) => {
  const { updatePropertyListState } = useNavigationStore();

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        updatePropertyListState({
          scrollPosition: elementRef.current.scrollTop
        });
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [elementRef, updatePropertyListState, ...dependencies]);
  
  // Restore scroll position on mount
  useEffect(() => {
    const { scrollPosition } = useNavigationStore.getState().propertyListState;
    if (elementRef.current && scrollPosition > 0) {
      elementRef.current.scrollTop = scrollPosition;
    }
  }, [elementRef]);
};

export default useNavigationTracker;
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaListAlt, FaBitcoin, FaTimes } from 'react-icons/fa';
import { searchPropertyService } from '../../../services/searchPropertyService';
import GeocodingService, { PlacePrediction } from '../../../services/geocodingService';
import SearchResults from './SearchResults';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';

// Get the GeocodingService instance
const geocodingService = GeocodingService.getInstance();

interface SearchResponse {
  properties: Property[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

interface LocationSuggestion {
  value: string;
  type: string;
}

const SearchBox: React.FC = () => {
  // Search state
  const [searchLocationTerm, setSearchLocationTerm] = useState<string>("");
  const [searchCategoryTerm, setSearchCategoryTerm] = useState<string>("");
  const [searchBudgetTerm, setSearchBudgetTerm] = useState<string>("");
  const [searchModeTerm, setSearchModeTerm] = useState<string>("");
  const [searchPropTypeTerm, setSearchPropTypeTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Autocomplete state
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoadingLocationSuggestions, setIsLoadingLocationSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  
  // Create a ref for the dropdown container and its parent container
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Handle location search with debounce
  useEffect(() => {
    if (!searchLocationTerm || searchLocationTerm.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoadingLocationSuggestions(true);
        // Try to get suggestions from our API first (from existing properties)
        const response = await searchPropertyService.getSearchSuggestions(searchLocationTerm);
        
        // Filter to only location type suggestions
        const locations = response.data.filter(
          (suggestion: LocationSuggestion) => suggestion.type === 'location'
        );
        
        if (locations.length > 0) {
          setLocationSuggestions(locations);
          setShowLocationDropdown(true);
          console.log('Found location suggestions:', locations);
        } else {
          // Fall back to Google Places API if no local suggestions
          try {
            const predictions = await geocodingService.getPlacePredictions(searchLocationTerm);
            const formattedPredictions = predictions.map((prediction: PlacePrediction) => ({
              value: prediction.description,
              type: 'location'
            }));
            setLocationSuggestions(formattedPredictions);
            setShowLocationDropdown(formattedPredictions.length > 0);
            console.log('Found Google predictions:', formattedPredictions);
          } catch (geocodeError) {
            console.error('Error fetching Google places predictions:', geocodeError);
          }
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      } finally {
        setIsLoadingLocationSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchLocationTerm]);

  // Handle location selection from dropdown
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    console.log('Location selected:', suggestion.value);
    setSearchLocationTerm(suggestion.value);
    setShowLocationDropdown(false);
    
    // Ensure the input field gets updated by focusing and then blurring
    if (locationInputRef.current) {
      locationInputRef.current.focus();
      locationInputRef.current.blur();
    }
  };

  // Handle main search
  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setSearchResults(null);
      
      const searchParams = {
        location: searchLocationTerm,
        category: searchCategoryTerm,
        budget: searchBudgetTerm,
        paymentMode: searchModeTerm,
        propertyType: searchPropTypeTerm,
        page: 1,
        limit: 10
      };

      const response = await searchPropertyService.searchProperties(searchParams);
      
      // Format the response based on the actual API structure
      const formattedResponse: SearchResponse = {
        properties: response.data?.properties || [],
        pagination: response.data?.pagination
      };
      
      setSearchResults(formattedResponse);
      setShowResults(true);
      
      // Try to save search query to history if user is logged in
      try {
        await searchPropertyService.saveSearchPreferences({
          preferredLocations: searchLocationTerm ? [searchLocationTerm] : undefined,
          preferredTypes: searchPropTypeTerm ? [searchPropTypeTerm] : undefined
        });
      } catch (error) {
        // Silently fail if not logged in or other error
        console.log('Unable to save search preferences:', error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchLocationTerm('');
    setSearchCategoryTerm('');
    setSearchBudgetTerm('');
    setSearchModeTerm('');
    setSearchPropTypeTerm('');
    setSearchResults(null);
    setShowResults(false);
  };

  // Clear individual filter
  const clearFilter = (filterName: string) => {
    switch (filterName) {
      case 'location':
        setSearchLocationTerm('');
        break;
      case 'category':
        setSearchCategoryTerm('');
        break;
      case 'budget':
        setSearchBudgetTerm('');
        break;
      case 'paymentMode':
        setSearchModeTerm('');
        break;
      case 'propertyType':
        setSearchPropTypeTerm('');
        break;
      default:
        break;
    }
  };

  // Handle closing results
  const handleCloseResults = () => {
    setShowResults(false);
  };

  // Style classes
  const inputGroupClassName = `
    relative flex items-center border-b border-gray-200 focus-within:border-rustyred 
    transition-all duration-300 group
  `;

  const inputClassName = `
    w-full px-3 py-3 bg-transparent
    placeholder:text-gray-400 text-gray-700 font-medium
    focus:outline-none
    transition-all duration-200
  `;

  const iconClassName = `
    text-gray-400 group-focus-within:text-rustyred ml-1 mr-2
    transition-all duration-300
  `;

  const filterCount = [
    searchLocationTerm, 
    searchCategoryTerm, 
    searchBudgetTerm, 
    searchModeTerm, 
    searchPropTypeTerm
  ].filter(Boolean).length;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationInputRef, dropdownRef]);

  // Update dropdown position when it's shown/hidden or when window is resized
  useEffect(() => {
    if (showLocationDropdown && locationInputRef.current && dropdownRef.current) {
      const updateDropdownPosition = () => {
        const inputRect = locationInputRef.current?.getBoundingClientRect();
        if (inputRect && dropdownRef.current) {
          // Set dropdown width to match input width
          dropdownRef.current.style.width = `${inputRect.width}px`;
          
          // Position dropdown absolutely below the input
          dropdownRef.current.style.top = `${inputRect.bottom}px`;
          dropdownRef.current.style.left = `${inputRect.left}px`;
          
          // Ensure dropdown is visible
          dropdownRef.current.style.opacity = '1';
          dropdownRef.current.style.visibility = 'visible';
          
          console.log('Updated dropdown position:', {
            width: dropdownRef.current.style.width,
            top: dropdownRef.current.style.top,
            left: dropdownRef.current.style.left
          });
        }
      };
      
      // Initial position update
      updateDropdownPosition();
      
      // Update position on window resize
      window.addEventListener('resize', updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition);
      
      return () => {
        window.removeEventListener('resize', updateDropdownPosition);
        window.removeEventListener('scroll', updateDropdownPosition);
      };
    }
  }, [showLocationDropdown, locationSuggestions]);

  return (
    <div className="w-full relative">
      {/* Simple background */}
      <div className="absolute inset-0 bg-milk/90 backdrop-blur-sm shadow-sm"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-10 overflow-hidden">
        {/* Heading with pin icon - preserved from original */}
        <h1 className="text-3xl font-florssolid md:text-5xl text-center mb-8 relative group">
          <span className="text-gray-800">A location</span>
          
          <span className="relative mx-2 text-gray-800">
            worth the
            <span className="inline-flex items-center">
              <svg className="w-8 h-8 inline-block ml-2 text-rustyred animate-bounce-subtle" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="font-extrabold text-rustyred">pin.</span>
            </span>
          </span>
        </h1>

        <div className="bg-white/10 rounded-xl shadow-md overflow-hidden">
          {/* Clear filters button (shows only when filters are active) */}
          {filterCount > 0 && (
            <div className="flex justify-end px-6 pt-4">
              <button 
                type="button"
                onClick={clearAllFilters}
                className="flex items-center text-rustyred hover:text-rustyred/80 text-sm font-medium transition-colors"
              >
                <FaTimes className="mr-1" />
                Clear {filterCount} filter{filterCount !== 1 ? 's' : ''}
              </button>
            </div>
          )}

          {/* Search fields in a cleaner layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-6">
              <div className={`${inputGroupClassName} relative`} ref={dropdownContainerRef}>
                <FaMapMarkerAlt className={iconClassName} />
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Enter Location"
                  value={searchLocationTerm}
                  onChange={(e) => setSearchLocationTerm(e.target.value)}
                  className={inputClassName}
                  onFocus={() => {
                    if (locationSuggestions.length > 0) {
                      setShowLocationDropdown(true);
                    }
                  }}
                />
                {searchLocationTerm && (
                  <button
                    type="button"
                    onClick={() => clearFilter('location')}
                    className="text-gray-400 hover:text-rustyred p-2"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
              
              <div className={inputGroupClassName}>
                <FaListAlt className={iconClassName} />
                <select
                  value={searchCategoryTerm}
                  onChange={(e) => setSearchCategoryTerm(e.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="for sale">For Sale</option>
                  <option value="for rent">For Rent</option>
                  <option value="for coown">For Co-ownership</option>
                </select>
                {searchCategoryTerm && (
                  <button
                    type="button"
                    onClick={() => clearFilter('category')}
                    className="text-gray-400 hover:text-rustyred p-2"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className={inputGroupClassName}>
                <FaHome className={iconClassName} />
                <select
                  value={searchPropTypeTerm}
                  onChange={(e) => setSearchPropTypeTerm(e.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>Property type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Beach House">Beach House</option>
                  <option value="Mountain Cabin">Mountain Cabin</option>
                </select>
                {searchPropTypeTerm && (
                  <button
                    type="button"
                    onClick={() => clearFilter('propertyType')}
                    className="text-gray-400 hover:text-rustyred p-2"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
              
              <div className={inputGroupClassName}>
                <FaMoneyBillWave className={iconClassName} />
                <select
                  value={searchBudgetTerm}
                  onChange={(e) => setSearchBudgetTerm(e.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>Estimated budget</option>
                  <option value="0-$10k">0-$10k</option>
                  <option value="$10k-$50k">$10k-$50k</option>
                  <option value="$50k-$100k">$50k-$100k</option>
                  <option value="$100k+">$100k+</option>
                </select>
                {searchBudgetTerm && (
                  <button
                    type="button"
                    onClick={() => clearFilter('budget')}
                    className="text-gray-400 hover:text-rustyred p-2"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className={inputGroupClassName}>
                <FaBitcoin className={iconClassName} />
                <select
                  value={searchModeTerm}
                  onChange={(e) => setSearchModeTerm(e.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>Mode of Payment</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
                {searchModeTerm && (
                  <button
                    type="button"
                    onClick={() => clearFilter('paymentMode')}
                    className="text-gray-400 hover:text-rustyred p-2"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
              
              <button 
                type="button" 
                onClick={handleSearch}
                disabled={isSearching}
                className={`
                  w-full py-3 bg-rustyred text-white rounded-lg
                  flex items-center justify-center gap-2
                  hover:bg-rustyred/90 hover:shadow-md
                  transition-all duration-300 font-medium
                  ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                <FaSearch className="text-white" />
                {isSearching ? 'Searching...' : 'Search Properties'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Dropdown - Moved outside of input container but still in the component */}
      {showLocationDropdown && locationSuggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute bg-white border border-gray-200 rounded-md shadow-xl z-50 mt-1 max-h-60 overflow-y-auto"
          style={{
            position: 'absolute',
            opacity: 0, // Initially hidden, will be updated by useEffect
            visibility: 'hidden' // Initially hidden, will be updated by useEffect
          }}
        >
          {isLoadingLocationSuggestions ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-rustyred border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ul>
              {locationSuggestions.map((suggestion, index) => (
                <li 
                  key={`${suggestion.value}-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start"
                  onClick={() => handleLocationSelect(suggestion)}
                >
                  <FaMapMarkerAlt className="text-rustyred mt-1 mr-2 flex-shrink-0" />
                  <span>{suggestion.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Search Results Modal */}
      <SearchResults
        results={searchResults}
        isVisible={showResults}
        onClose={handleCloseResults}
        searchParams={{
          location: searchLocationTerm,
          category: searchCategoryTerm,
          budget: searchBudgetTerm,
          paymentMode: searchModeTerm,
          propertyType: searchPropTypeTerm
        }}
      />
    </div>
  );
};

export default SearchBox;
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { PlacePrediction } from '../../../../services/geocodingService';

interface SearchResultsDropdownProps {
  show: boolean;
  searchInput: string;
  searchResults: PlacePrediction[];
  isSearching: boolean;
  inputRect: DOMRect | null;
  portalElement: HTMLElement | null;
  onResultSelect: (result: PlacePrediction) => void;
}

// SearchResultItem component for handling individual search results
const SearchResultItem = ({ 
  result, 
  onSelect 
}: { 
  result: PlacePrediction; 
  onSelect: (result: PlacePrediction) => void 
}) => {
  // Separate handler functions for different events to ensure click is captured
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent blur event which would close dropdown
    console.log("Mouse down on result:", result.place_id);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Clicked on result:", result.place_id);
    onSelect(result);
  };
  
  const mainText = result.structured_formatting?.main_text || result.description;
  const secondaryText = result.structured_formatting?.secondary_text || '';
  
  return (
    <li 
      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      data-place-id={result.place_id}
      role="option"
      aria-selected="false"
    >
      <div className="flex items-start">
        <FaMapMarkerAlt className="text-celadon mt-1 mr-2 flex-shrink-0" />
        <div>
          <div className="font-medium">
            {mainText}
          </div>
          {secondaryText && (
            <div className="text-sm text-gray-500">
              {secondaryText}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({
  show,
  searchInput,
  searchResults,
  isSearching,
  inputRect,
  portalElement,
  onResultSelect
}) => {
  // Debug logging on every render
  useEffect(() => {
    console.log("========== DROPDOWN COMPONENT RENDER ==========");
    console.log("show:", show);
    console.log("searchResults:", searchResults.length);
    console.log("inputRect:", inputRect);
    console.log("portalElement:", portalElement);
    
    if (show && searchResults.length > 0 && inputRect && portalElement) {
      console.log("✅ SHOULD RENDER DROPDOWN");
    } else {
      console.log("❌ NOT RENDERING DROPDOWN because:");
      if (!show) console.log("  - show is false");
      if (!searchResults.length) console.log("  - no search results");
      if (!inputRect) console.log("  - no inputRect");
      if (!portalElement) console.log("  - no portalElement");
    }
  });
  
  // Don't render if conditions aren't met
  if (!show || !portalElement || !inputRect) {
    return null;
  }
  
  // Add direct console.log that will appear even if the component doesn't render
  console.log(`🔍 Creating dropdown with ${searchResults.length} results`);
  
  // Create a unique ID for this dropdown to help with debugging
  const dropdownId = `dropdown-${Date.now()}`;
  
  // Calculate dropdown position
  const dropdownStyle = {
    position: 'absolute' as const,
    top: `${inputRect.bottom + 5}px`,
    left: `${inputRect.left}px`,
    width: `${inputRect.width}px`,
    zIndex: 9999999,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    borderRadius: '4px',
    maxHeight: '300px',
    overflowY: 'auto' as const
  };
  
  // Create dropdown content
  const dropdownContent = (
    <div 
      id={dropdownId}
      data-testid="search-results-dropdown"
      style={dropdownStyle}
      role="listbox"
    >
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((result) => (
            <SearchResultItem 
              key={result.place_id} 
              result={result} 
              onSelect={onResultSelect} 
            />
          ))}
        </ul>
      ) : (
        searchInput.length >= 2 && !isSearching && (
          <div className="bg-white p-3 rounded-lg">
            <p className="text-gray-500">No results found for "{searchInput}"</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term or select a location on the map.</p>
          </div>
        )
      )}
      
      {isSearching && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-celadon border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
  
  console.log("📦 Creating portal for dropdown");
  const portal = ReactDOM.createPortal(dropdownContent, portalElement);
  console.log("✅ Portal created");
  return portal;
};

export default SearchResultsDropdown;
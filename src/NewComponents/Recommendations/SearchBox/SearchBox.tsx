import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHome, FaMoneyBillWave, FaListAlt, FaBitcoin } from 'react-icons/fa';
import { searchPropertyService } from '../../../services/searchPropertyService';
import SearchResults from './SearchResults';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';

interface SearchResponse {
  properties: Property[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

const SearchBox: React.FC = () => {
  const [searchLocationTerm, setSearchLocationTerm] = useState<string>("");
  const [searchCategoryTerm, setSearchCategoryTerm] = useState<string>("");
  const [searchBudgetTerm, setSearchBudgetTerm] = useState<string>("");
  const [searchModeTerm, setSearchModeTerm] = useState<string>("");
  const [searchPropTypeTerm, setSearchPropTypeTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

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
      const formattedResponse: SearchResponse = {
        properties: response.properties || [],
        pagination: response.pagination
      };
      setSearchResults(formattedResponse);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

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

  return (
    <div className="w-full relative">
      {/* Simple background */}
      <div className="absolute inset-0 bg-milk/90 backdrop-blur-sm  shadow-sm "></div>
      
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
          {/* Search fields in a cleaner layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 ">
            <div className="space-y-6">
              <div className={inputGroupClassName}>
                <FaMapMarkerAlt className={iconClassName} />
                <input
                  type="text"
                  placeholder="Enter Location"
                  value={searchLocationTerm}
                  onChange={(e) => setSearchLocationTerm(e.target.value)}
                  className={inputClassName}
                />
              </div>
              
              <div className={inputGroupClassName}>
                <FaListAlt className={iconClassName} />
                <select
                  value={searchCategoryTerm}
                  onChange={(e) => setSearchCategoryTerm(e.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
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
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
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
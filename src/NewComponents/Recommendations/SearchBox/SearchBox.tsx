import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../../services/propertyService';

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocationTerm, setSearchLocationTerm] = useState<string>("");
  const [searchCategoryTerm, setSearchCategoryTerm] = useState<string>("");
  const [searchBudgetTerm, setSearchBudgetTerm] = useState<string>("");
  const [searchModeTerm, setSearchModeTerm] = useState<string>("");
  const [searchPropTypeTerm, setSearchPropTypeTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      
      const searchParams = {
        location: searchLocationTerm,
        category: searchCategoryTerm,
        budget: searchBudgetTerm,
        paymentMode: searchModeTerm,
        propertyType: searchPropTypeTerm,
        page: 1,
        limit: 10
      };

      const response = await propertyService.searchProperties(searchParams);
      
      // Navigate to search results page with the search parameters
      navigate('/search-results', { 
        state: { 
          searchResults: response.data,
          searchParams 
        } 
      });
    } catch (error) {
      console.error('Search error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSearching(false);
    }
  };

  const inputClassName = `
    w-full px-4 py-3 rounded-lg bg-milk border border-graphite/10
    placeholder:text-graphite/50 text-graphite
    focus:outline-none focus:border-desertclay focus:ring-1 focus:ring-desertclay
    transition-all duration-200
  `;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-helvetica text-center mb-8">
        <span className="text-desertclay">Find</span> Your Perfect Property
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white/80 backdrop-blur-sm 
                    p-6 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Enter Location"
          value={searchLocationTerm}
          onChange={(e) => setSearchLocationTerm(e.target.value)}
          className={inputClassName}
        />

        <select
          value={searchCategoryTerm}
          onChange={(e) => setSearchCategoryTerm(e.target.value)}
          className={inputClassName}
        >
          <option value="" disabled>Select Category</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
        </select>

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

        <button 
          type="button" 
          onClick={handleSearch}
          disabled={isSearching}
          className={`w-full px-6 py-3 bg-desertclay text-milk rounded-lg
                   hover:bg-lightstone hover:text-graphite
                   transition-all duration-300 font-medium
                   shadow-md hover:shadow-lg
                   ${isSearching ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isSearching ? 'Searching...' : 'Search Properties'}
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
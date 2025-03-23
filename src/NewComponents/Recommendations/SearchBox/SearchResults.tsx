import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';
import { FaBed, FaBath, FaRulerCombined, FaMoneyBillWave, FaTimes, FaChevronLeft, FaChevronRight , FaSearch} from 'react-icons/fa';
import { searchPropertyService } from '../../../services/searchPropertyService';

interface SearchResultsProps {
  results: {
    properties: Property[];
    pagination?: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  } | null;
  isVisible: boolean;
  onClose: () => void;
  searchParams: {
    location?: string;
    category?: string;
    budget?: string;
    paymentMode?: string;
    propertyType?: string;
  };
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isVisible, 
  onClose,
  searchParams 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paginatedResults, setPaginatedResults] = useState<Property[]>([]);

  // Handle changing pages
  const handlePageChange = async (page: number) => {
    if (!results || !results.pagination) return;
    
    if (page === results.pagination.page) return;
    
    try {
      setIsLoading(true);
      
      // Fetch the next page of results
      const response = await searchPropertyService.searchProperties({
        ...searchParams,
        page,
        limit: results.pagination.limit || 10
      });
      
      // Update the page number
      setCurrentPage(page);
      
      // Update the displayed results
      if (response.data?.properties) {
        setPaginatedResults(response.data.properties);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  // Early return with loading state if results is null
  if (!results) {
    return (
      <div className="fixed inset-0 bg-graphite/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-milk rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-helvetica text-graphite">
                  Searching...
                </h2>
                <button
                  onClick={onClose}
                  className="text-graphite/60 hover:text-desertclay transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-rustyred border-t-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { properties = [], pagination } = results;
  const totalResults = pagination?.total ?? properties.length;
  const pagesToShow = pagination?.pages ?? 1;
  const displayProperties = paginatedResults.length > 0 && currentPage > 1 ? paginatedResults : properties;

  // If we have no properties, show empty state
  if (displayProperties.length === 0) {
    return (
      <div className="fixed inset-0 bg-graphite/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-milk rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-helvetica text-graphite">
                  Search Results (0)
                </h2>
                <button
                  onClick={onClose}
                  className="text-graphite/60 hover:text-desertclay transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Search Parameters Summary */}
              <div className="flex flex-wrap gap-2 text-sm text-graphite/70 mb-6">
                {Object.entries(searchParams).map(([key, value]) => {
                  if (value) {
                    return (
                      <span key={key} className="bg-lightstone/30 px-2 py-1 rounded">
                        {key}: {value}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-lightstone/20 rounded-full p-6 mb-4">
                  <FaSearch className="text-rustyred/50 text-4xl" />
                </div>
                <h3 className="text-xl font-medium text-graphite mb-2">No properties found</h3>
                <p className="text-graphite/70 max-w-md">
                  We couldn't find any properties matching your search criteria. Try adjusting your filters or searching for a different location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-graphite/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="bg-milk rounded-t-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-helvetica text-graphite">
                {isLoading ? 'Loading results...' : `Search Results (${totalResults})`}
              </h2>
              <button
                onClick={onClose}
                className="text-graphite/60 hover:text-desertclay transition-colors p-2"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Search Parameters Summary */}
            <div className="flex flex-wrap gap-2 text-sm text-graphite/70">
              {Object.entries(searchParams).map(([key, value]) => {
                if (value) {
                  return (
                    <span key={key} className="bg-lightstone/30 px-2 py-1 rounded">
                      {key}: {value}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Results Grid */}
          <div className="bg-milk/95 p-6 rounded-b-xl shadow-lg">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-b-xl z-10">
                <div className="animate-spin h-10 w-10 border-4 border-rustyred border-t-transparent rounded-full"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {displayProperties.map((property) => (
                <Link
                  key={property._id}
                  to={`/property/${property._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl 
                           transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Property Image */}
                  <div className="relative h-48">
                    <img
                      src={property.images[0] || '/placeholder-property.jpg'}
                      alt={property.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-desertclay text-milk px-3 py-1 rounded-full text-sm">
                      {property.action}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-graphite mb-2 truncate">
                      {property.propertyName}
                    </h3>
                    <p className="text-graphite/70 text-sm mb-3 truncate">
                      {property.location}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-1 text-desertclay font-semibold mb-3">
                      <FaMoneyBillWave />
                      <span>${property.price.toLocaleString()}</span>
                      {property.cryptoAccepted && (
                        <span className="ml-2 bg-lightstone/30 px-2 py-0.5 rounded text-xs font-medium text-graphite">
                          Crypto Accepted
                        </span>
                      )}
                    </div>

                    {/* Property Features */}
                    <div className="flex items-center gap-4 text-sm text-graphite/70">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <FaBed />
                          <span>{property.bedrooms} beds</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <FaBath />
                          <span>{property.bathrooms} baths</span>
                        </div>
                      )}
                      {property.space > 0 && (
                        <div className="flex items-center gap-1">
                          <FaRulerCombined />
                          <span>{property.space} sqft</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  className={`px-3 py-2 rounded-md flex items-center ${
                    currentPage <= 1 || isLoading
                      ? 'bg-lightstone/30 text-graphite/40 cursor-not-allowed'
                      : 'bg-lightstone/30 text-graphite hover:bg-lightstone/50'
                  }`}
                >
                  <FaChevronLeft className="mr-1" />
                  <span>Prev</span>
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: pagesToShow }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages adjacent to current page
                    const isFirstOrLast = page === 1 || page === pagesToShow;
                    const isNearCurrent = Math.abs(page - currentPage) <= 1;
                    return isFirstOrLast || isNearCurrent;
                  })
                  .map((page, index, filteredPages) => {
                    // Add ellipsis between non-consecutive pages
                    const prevPage = index > 0 ? filteredPages[index - 1] : null;
                    const showEllipsis = prevPage && page - prevPage > 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-3 py-2 text-graphite">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          disabled={isLoading}
                          className={`px-4 py-2 rounded-md ${
                            page === currentPage
                              ? 'bg-desertclay text-milk'
                              : 'bg-lightstone/30 text-graphite hover:bg-lightstone/50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                
                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagesToShow || isLoading}
                  className={`px-3 py-2 rounded-md flex items-center ${
                    currentPage >= pagesToShow || isLoading
                      ? 'bg-lightstone/30 text-graphite/40 cursor-not-allowed'
                      : 'bg-lightstone/30 text-graphite hover:bg-lightstone/50'
                  }`}
                >
                  <span>Next</span>
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
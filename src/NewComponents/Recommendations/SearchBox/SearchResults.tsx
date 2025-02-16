import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';
import { FaBed, FaBath, FaRulerCombined, FaMoneyBillWave } from 'react-icons/fa';

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
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { properties = [], pagination } = results;
  const totalResults = pagination?.total ?? properties.length;
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.pages ?? 1;

  return (
    <div className="fixed inset-0 bg-graphite/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="bg-milk rounded-t-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-helvetica text-graphite">
                Search Results ({totalResults})
              </h2>
              <button
                onClick={onClose}
                className="text-graphite/60 hover:text-desertclay transition-colors"
              >
                Close
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
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
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
                        {property.currency && <span className="text-sm">({property.currency})</span>}
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
            ) : (
              <div className="text-center py-12">
                <p className="text-graphite/70 text-lg">
                  No properties found matching your search criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded ${
                      page === currentPage
                        ? 'bg-desertclay text-milk'
                        : 'bg-lightstone/30 text-graphite hover:bg-lightstone/50'
                    }`}
                    // Add page change handler here if needed
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { propertyService } from '../../services/propertyService';
import HeroPropertyCard from './HeroPropertyCard';
import HeroPropertyFocus from './HeroPropertyFocus';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';

interface TrendingPropertiesProps {
  properties: Property[];
}

const TrendingProperties: React.FC<TrendingPropertiesProps> = ({ properties }) => {
  const [trendingProperties, setTrendingProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Define items per row based on screen size
  const itemsPerRow = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  // Properties to display per page (2 rows * 3 columns = 6 items)
  const itemsPerPage = 6;
  const maxInitialProperties = 50;

  useEffect(() => {
    const fetchTrendingProperties = async () => {
      try {
        setIsLoading(true);
        const response = await propertyService.getTrendingProperties(maxInitialProperties);
        setTrendingProperties(response.data);
        // Log popularity scores
        response.data.forEach((property: Property, index: number) => {
          console.log(`Property ${index + 1}: ${property.propertyName} - Popularity Score: ${property.popularityScore}`);
        });
        setHasMore(response.data.length === maxInitialProperties);
      } catch (error) {
        console.error('Error fetching trending properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProperties();
  }, []);

  const loadMoreProperties = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const response = await propertyService.getTrendingProperties(
        maxInitialProperties,
        trendingProperties.length
      );
      setTrendingProperties(prev => [...prev, ...response.data]);
      setHasMore(response.data.length === maxInitialProperties);
    } catch (error) {
      console.error('Error loading more properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(trendingProperties.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const visibleProperties = trendingProperties.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="relative w-full px-4 md:px-8 lg:px-16 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl ml-8 font-bold text-gray-800">Trending Properties</h2>
        
        {/* Navigation Dots for Mobile */}
        <div className="flex gap-2 md:hidden">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === idx ? 'bg-celadon' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative px-8">
        {/* Left Navigation Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
            bg-white shadow-lg hover:bg-gray-100 transition-colors ${
            currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {visibleProperties.map((property) => (
            <div key={property._id} className="w-full transform transition-transform duration-300 hover:scale-[1.02]">
              <HeroPropertyCard 
                property={property}
                onWishlistUpdate={async (propertyId: string) => {
                  try {
                    await propertyService.updateWishlist(propertyId, 'add');
                    // Refresh the properties list to get updated popularity scores
                    const response = await propertyService.getTrendingProperties(maxInitialProperties);
                    setTrendingProperties(response.data);
                  } catch (error) {
                    console.error('Error updating wishlist:', error);
                  }
                }}
                onClick={async (propertyId: string) => {
                  try {
                    await propertyService.incrementPropertyClicks(propertyId);
                    setSelectedProperty(property);
                    // Refresh the properties list to get updated popularity scores
                    const response = await propertyService.getTrendingProperties(maxInitialProperties);
                    setTrendingProperties(response.data);
                  } catch (error) {
                    console.error('Error incrementing clicks:', error);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <button
            onClick={loadMoreProperties}
            className="bg-celadon text-white py-2 px-4 rounded-full mt-4"
          >
            Load More
          </button>
        )}

        {/* Right Navigation Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
            bg-white shadow-lg hover:bg-gray-100 transition-colors ${
            currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FaChevronRight size={24} />
        </button>
      </div>

      {/* Page Indicator */}
      <div className="hidden md:flex justify-center gap-3 mt-6">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentPage === idx ? 'bg-celadon' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Property Focus Modal */}
      {selectedProperty && (
        <HeroPropertyFocus
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default TrendingProperties;
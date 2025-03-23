import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeroPropertyCard from '../HeroPropertyCard';
import { Property } from '../../ListerDashBoard/Properties/propertyTypes';
import { propertyService } from '../../../services/propertyService';

interface RecommendedFromSearchProps {
  currentPropertyId: string;
  propertyType?: string;
  location?: string;
}

const RecommendedFromSearch: React.FC<RecommendedFromSearchProps> = ({ 
  currentPropertyId,
  propertyType,
  location
}) => {
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Number of properties to show at once

  useEffect(() => {
    const fetchRecommendedProperties = async () => {
      try {
        setLoading(true);
        
        // We'll use simple search to find similar properties
        // This could be enhanced in the future with more sophisticated recommendation logic
        const response = await propertyService.searchProperties({
          propertyType: propertyType,
          location: location ? location.split(',')[0] : undefined, // Just use the first part of the location
        });
        
        // Filter out the current property and limit to 6 properties
        const filtered = response.data?.properties?.filter(
          (property: Property) => property._id !== currentPropertyId
        ).slice(0, 6) || [];
        
        setRecommendedProperties(filtered);
      } catch (error) {
        console.error('Error fetching recommended properties:', error);
        setRecommendedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (propertyType || location) {
      fetchRecommendedProperties();
    }
  }, [currentPropertyId, propertyType, location]);

  // Handle property clicks for analytics
  const handlePropertyClick = async (propertyId: string) => {
    try {
      await propertyService.incrementPropertyClicks(propertyId);
    } catch (error) {
      console.error('Error incrementing property clicks:', error);
    }
  };

  // Handle wishlist updates
  const handleWishlistUpdate = async (propertyId: string, action: 'add' | 'remove') => {
    try {
      await propertyService.updateWishlist(propertyId, action);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // If we have no recommendations or they're still loading, don't render the component
  if (loading) {
    return (
      <div className="bg-white/50 rounded-lg p-6 shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendedProperties.length === 0) {
    return null; // Don't render if no recommendations
  }

  const nextSlide = () => {
    if (currentIndex < recommendedProperties.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleProperties = recommendedProperties.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className="bg-white/50 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-graphite mb-6">Similar Properties</h2>
      
      <div className="relative">
        {/* Previous slide button */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                      bg-white shadow-md border border-lightstone/30
                      hover:bg-rustyred hover:text-white hover:border-rustyred
                      transition-all duration-300 focus:outline-none"
          >
            <FaChevronLeft size={16} />
          </button>
        )}

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleProperties.map((property) => (
            <div 
              key={property._id} 
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <HeroPropertyCard
                property={property}
                onClick={handlePropertyClick}
                onWishlistUpdate={handleWishlistUpdate}
              />
            </div>
          ))}
        </div>

        {/* Next slide button */}
        {currentIndex < recommendedProperties.length - itemsPerPage && (
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                      bg-white shadow-md border border-lightstone/30
                      hover:bg-rustyred hover:text-white hover:border-rustyred
                      transition-all duration-300 focus:outline-none"
          >
            <FaChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendedFromSearch;
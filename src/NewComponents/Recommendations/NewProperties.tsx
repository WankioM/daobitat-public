import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from 'react-icons/fa';
import HeroPropertyCard from './HeroPropertyCard';
import HeroPropertyFocus from './HeroPropertyFocus';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';
import { propertyService } from '../../services/propertyService';

interface NewPropertiesProps {
  properties: Property[];
}

const NewProperties: React.FC<NewPropertiesProps> = ({ properties }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newProperties, setNewProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 3; // Show 3 properties at a time

  useEffect(() => {
    const fetchNewProperties = async () => {
      try {
        const response = await propertyService.getLatestProperties();
        if (response.status === 'success' && Array.isArray(response.data)) {
          setNewProperties(response.data);
        }
      } catch (error) {
        console.error('Error fetching new properties:', error);
        setNewProperties([]);
      }
    };

    fetchNewProperties();
  }, []);

  const slideLeft = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const slideRight = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    if (currentIndex < newProperties.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // No longer need the toggle expand function or visibleProperties

  return (
    <div className="relative w-full py-12 bg-milk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with subtle design touches */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h2 className="text-3xl font-florssolid text-graphite">Latest Properties</h2>
            <div className="absolute -bottom-2 left-0 w-24 h-1 bg-rustyred rounded-full"></div>
          </div>
          
          <div className="text-graphite font-medium">
            <span>Scroll to explore</span>
            <span className="ml-2 text-rustyred">→</span>
          </div>
        </div>

        {/* Properties carousel with improved navigation */}
        <div className="relative">
          {/* Left Navigation Button */}
          <button
            onClick={slideLeft}
            disabled={currentIndex === 0 || isTransitioning}
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                      bg-white shadow-md border border-lightstone/30
                      transition-all duration-300 focus:outline-none
                      ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 
                      'hover:bg-rustyred hover:text-white hover:border-rustyred'}`}
            aria-label="Previous properties"
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Properties Grid with smooth transition */}
          <div className="overflow-hidden px-2">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` 
              }}
            >
              {newProperties.map((property) => (
                <div 
                  key={property._id} 
                  className="transform transition-all duration-300 hover:translate-y-[-8px] w-full md:w-1/3 flex-shrink-0 px-3"
                >
                  <HeroPropertyCard 
                    property={property}
                    onWishlistUpdate={async (propertyId: string) => {
                      try {
                        await propertyService.updateWishlist(propertyId, 'add');
                      } catch (error) {
                        console.error('Error updating wishlist:', error);
                      }
                    }}
                    onClick={async (propertyId: string) => {
                      try {
                        await propertyService.incrementPropertyClicks(propertyId);
                        setSelectedProperty(property);
                      } catch (error) {
                        console.error('Error incrementing clicks:', error);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={slideRight}
            disabled={currentIndex >= newProperties.length - itemsPerPage || isTransitioning}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                      bg-white shadow-md border border-lightstone/30
                      transition-all duration-300 focus:outline-none
                      ${currentIndex >= newProperties.length - itemsPerPage ? 
                      'opacity-40 cursor-not-allowed' : 
                      'hover:bg-rustyred hover:text-white hover:border-rustyred'}`}
            aria-label="Next properties"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* Navigation Dots - Elegant indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: Math.min(10, newProperties.length) }).map((_, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 focus:outline-none ${
                  isActive 
                    ? 'w-8 h-2 bg-rustyred rounded-full' 
                    : 'w-2 h-2 bg-lightstone rounded-full hover:bg-desertclay/50'
                }`}
                aria-label={`Go to property ${idx + 1}`}
              />
            );
          })}
          {newProperties.length > 10 && 
            <span className="text-graphite self-center">...</span>
          }
        </div>
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

export default NewProperties;
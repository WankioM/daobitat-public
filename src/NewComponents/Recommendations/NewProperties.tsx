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
  const [isExpanded, setIsExpanded] = useState(false);
  const [newProperties, setNewProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const itemsPerPage = isExpanded ? 6 : 3;

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
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const slideRight = () => {
    setCurrentIndex((prev) => 
      Math.min(prev + itemsPerPage, Math.max(0, newProperties.length - itemsPerPage))
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setCurrentIndex(0);
  };

  const visibleProperties = newProperties.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative w-full px-16 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl ml-8 font-bold text-gray-800">Latest Properties</h2>
        <button
          onClick={toggleExpand}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? (
            <>
              <FaCompress size={20} />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <FaExpand size={20} />
              <span>Expand</span>
            </>
          )}
        </button>
      </div>

      <div className="relative px-12">
        {/* Left Navigation Button */}
        <button
          onClick={slideLeft}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg mr-4 ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Properties Grid */}
        <div className="grid grid-cols-3 gap-8">
          {visibleProperties.map((property) => (
            <div key={property._id} className="w-full">
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

        {/* Right Navigation Button */}
        <button
          onClick={slideRight}
          disabled={currentIndex >= newProperties.length - itemsPerPage}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg ml-4 ${
            currentIndex >= newProperties.length - itemsPerPage 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100'
          }`}
        >
          <FaChevronRight size={24} />
        </button>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {Array.from({ length: Math.ceil(newProperties.length / itemsPerPage) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx * itemsPerPage)}
            className={`w-2 h-2 rounded-full ${
              Math.floor(currentIndex / itemsPerPage) === idx ? 'bg-celadon' : 'bg-gray-300'
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

export default NewProperties;
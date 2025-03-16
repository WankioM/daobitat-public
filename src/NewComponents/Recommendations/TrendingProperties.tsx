import React, { useEffect, useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
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
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed number of properties per page - 6 properties (2 rows of 3)
  const propertiesPerPage = 6;

  useEffect(() => {
    const fetchTrendingProperties = async () => {
      try {
        setIsLoading(true);
        const response = await propertyService.getTrendingProperties(100); // Fetch more initially
        setTrendingProperties(response.data || []);
      } catch (error) {
        console.error('Error fetching trending properties:', error);
        setTrendingProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProperties();
  }, []);

  const totalPages = Math.max(1, Math.ceil(trendingProperties.length / propertiesPerPage));

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      scrollToTop();
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get current page properties
  const visibleProperties = trendingProperties.slice(
    currentPage * propertiesPerPage,
    (currentPage + 1) * propertiesPerPage
  );

  return (
    <div ref={containerRef} className="relative w-full pt-24 py-16 bg-milk/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with trending fire icon */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative flex items-center">
            <h2 className="text-3xl font-florssolid text-graphite">Trending Properties</h2>
            <FaFire className="ml-3 text-rustyred animate-pulse" size={24} />
            <div className="absolute -bottom-2 left-0 w-48 h-1 bg-rustyred rounded-full"></div>
          </div>
          
          <div className="text-graphite font-medium">
            <span>Scroll to explore</span>
            <span className="ml-2 text-rustyred">→</span>
          </div>
        </div>

        {/* Properties display */}
        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rustyred"></div>
            </div>
          ) : (
            <>
              {/* Left Navigation Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                          bg-white shadow-md border border-lightstone/30
                          transition-all duration-300 focus:outline-none
                          ${currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 
                          'hover:bg-rustyred hover:text-white hover:border-rustyred'}`}
                aria-label="Previous properties"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Simple Grid Layout - More Robust */}
              <div className="px-2 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProperties.map((property) => (
                    <div 
                      key={property._id} 
                      className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
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
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                          bg-white shadow-md border border-lightstone/30
                          transition-all duration-300 focus:outline-none
                          ${currentPage >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 
                          'hover:bg-rustyred hover:text-white hover:border-rustyred'}`}
                aria-label="Next properties"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Navigation Dots - Simple and Reliable */}
        {trendingProperties.length > propertiesPerPage && (
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: Math.min(7, totalPages) }).map((_, idx) => {
              // Handle pagination display logic for many pages
              let pageIdx = idx;
              
              if (totalPages > 7) {
                if (currentPage < 3) {
                  // First 5 pages + ellipsis + last page
                  if (idx === 5) return <span key="ellipsis" className="mx-1 self-end">...</span>;
                  if (idx === 6) pageIdx = totalPages - 1;
                } else if (currentPage >= totalPages - 3) {
                  // First page + ellipsis + last 5 pages
                  if (idx === 1) return <span key="ellipsis" className="mx-1 self-end">...</span>;
                  if (idx > 1) pageIdx = totalPages - 7 + idx;
                } else {
                  // First page + ellipsis + current & neighbors + ellipsis + last page
                  if (idx === 1) return <span key="ellipsis1" className="mx-1 self-end">...</span>;
                  if (idx === 5) return <span key="ellipsis2" className="mx-1 self-end">...</span>;
                  if (idx === 0) pageIdx = 0;
                  if (idx === 6) pageIdx = totalPages - 1;
                  if (idx > 1 && idx < 5) pageIdx = currentPage + (idx - 3);
                }
              }
              
              const isActive = currentPage === pageIdx;
              
              return (
                <button
                  key={`page-${pageIdx}`}
                  onClick={() => goToPage(pageIdx)}
                  className={`transition-all duration-300 focus:outline-none ${
                    isActive 
                      ? 'w-8 h-2 bg-rustyred rounded-full' 
                      : 'w-2 h-2 bg-lightstone rounded-full hover:bg-desertclay/50'
                  }`}
                  aria-label={`Go to page ${pageIdx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingProperties;
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { propertyService } from '../../services/propertyService';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define property type to match the actual API response
interface ApiProperty {
  _id: string;
  propertyName: string;
  price: number;
  location: string;
  images?: string[];
  // Add other fields as needed
}

const FeaturedProperties = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        // Try fetching featured properties first
        let response = await propertyService.getFeaturedProperties();
        let allProperties = response.data || [];
        
        // If not enough featured properties, try getting trending properties
        if (allProperties.length < 8) {
          const trendingResponse = await propertyService.getTrendingProperties(20);
          const trendingProperties = trendingResponse.data || [];
          
          // Combine unique properties from both sources
          const combinedProperties = [...allProperties];
          
          // Add trending properties that aren't already in the featured list
          for (const prop of trendingProperties) {
            if (!combinedProperties.some((p: ApiProperty) => p._id === prop._id)) {
              combinedProperties.push(prop);
            }
          }
          
          allProperties = combinedProperties;
        }
        
        // If we still don't have enough, get the latest properties
        if (allProperties.length < 8) {
          const latestResponse = await propertyService.getLatestProperties();
          const latestProperties = latestResponse.data || [];
          
          // Add latest properties that aren't already in our list
          for (const prop of latestProperties) {
            if (!allProperties.some((p: ApiProperty) => p._id === prop._id)) {
              allProperties.push(prop);
            }
          }
        }
        
        // Randomly select 8 properties (or fewer if we don't have 8)
        let selectedProperties: ApiProperty[];
        if (allProperties.length <= 8) {
          selectedProperties = allProperties;
        } else {
          // Shuffle array and take first 8
          selectedProperties = [...allProperties]
            .sort(() => 0.5 - Math.random())
            .slice(0, 8);
        }
        
        setProperties(selectedProperties);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (isLoading || properties.length === 0) return;

    // Initial animation for the container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Staggered animation for each card
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom-=100",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      }
    );

    if (scrollerRef.current && properties.length > 0) {
      const scrollerElement = scrollerRef.current;
      const contentWrapper = scrollerElement.children[0] as HTMLElement;
      
      // Create a loop that completes one full cycle then pauses
      const createFiniteLoop = () => {
        // First, duplicate the content
        const originalCards = Array.from(contentWrapper.children) as HTMLElement[];
        
        // Clone cards once
        for (let i = 0; i < 3; i++) {
          originalCards.forEach(card => {
            const clone = card.cloneNode(true) as HTMLElement;
            clone.setAttribute('aria-hidden', 'true'); // For accessibility
            contentWrapper.appendChild(clone);
          });
        }
        
        // Calculate dimensions
        const cardWidth = originalCards[0]?.offsetWidth || 300;
        const gapWidth = 24; // This should match your CSS gap-6 (6 * 4px = 24px)
        const itemWidth = cardWidth + gapWidth;
        const singleSetWidth = originalCards.length * itemWidth;
        const totalWidth = singleSetWidth * 4; // Original + clones
        
        // Animation variables
        let scrollSpeed = 0.5; // Slow speed for gentle scrolling
        const baseSpeed = 0.5;
        const maxSpeed = 5;
        let animationId: number;
        let isPaused = false;
        let currentPosition = 0;
        let completedFullCycle = false;
        
        // Animation function
        const scroll = () => {
          if (!isPaused) {
            // Increment position
            currentPosition += scrollSpeed;
            
            // Loop back to start when we reach the end
            if (currentPosition >= totalWidth) {
              currentPosition = 0;
            }
            
            // Apply the transform
            contentWrapper.style.transform = `translateX(-${currentPosition}px)`;
          }
          
          animationId = requestAnimationFrame(scroll);
        };
        
        // Start the animation
        animationId = requestAnimationFrame(scroll);
        
        // Pause/resume on hover
        scrollerElement.addEventListener('mouseenter', () => {
           
            isPaused = true;
          
        });
        
        scrollerElement.addEventListener('mouseleave', () => {
         
            isPaused = false;
          
        });
        
        // Handle manual scrolling - clicking will restart the animation if it's completed
        scrollerElement.addEventListener('wheel', (e) => {
          e.preventDefault();
          
          
          
          // Temporarily increase scroll speed and resume animation
          isPaused = false;
          scrollSpeed = maxSpeed;
          
          if (e.deltaY < 0) {
            // Backward scroll
            currentPosition -= 10;
            if (currentPosition < 0) {
              currentPosition = totalWidth + currentPosition;
            }
          } else {
            // Forward scroll
            currentPosition += 10;
          }
          
          // Apply immediately
          contentWrapper.style.transform = `translateX(-${currentPosition}px)`;
          
          // Reset speed after delay
          setTimeout(() => {
            scrollSpeed = baseSpeed;
          }, 500);
        });
        
        
        
        
        // Clean up on unmount
        return () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        };
      };
      
      // Create the loop
      return createFiniteLoop();
    }
  }, [isLoading, properties]);

  // Function to add card to refs
const addToRefs = (el: HTMLDivElement | null) => {
  if (el && !cardsRef.current.includes(el)) {
    cardsRef.current.push(el);
  }
};
   

  // Helper function to handle property clicks for analytics
  const handlePropertyClick = async (propertyId: string) => {
    try {
      await propertyService.incrementPropertyClicks(propertyId);
    } catch (error) {
      console.error('Error incrementing property clicks:', error);
    }
  };

  return (
    <div className="w-full bg-transparent py-12 pt-8 px-4 md:px-12" ref={containerRef}>
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {/* Optional: Add scroll controls here if needed */}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-rustyred border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-graphite text-lg">{error}</p>
          </div>
        ) : (
          // Horizontal scrolling container
          <div className="overflow-x-auto hide-scrollbar" ref={scrollerRef}>
            <div className="flex gap-6 pb-4 will-change-transform">
            {properties.map((property) => (
              <div 
                key={property._id}
                ref={addToRefs}
                onClick={() => handlePropertyClick(property._id)}
                className="w-[300px] flex-shrink-0 rounded-lg overflow-hidden relative shadow-md 
                          group cursor-pointer transition-all duration-500 hover:shadow-xl"
              >
                  {/* Image container with fixed aspect ratio */}
                  <div className="relative pt-[66%]"> {/* 2:3 aspect ratio */}
                    <img 
                      src={property.images && property.images.length > 0 
                        ? property.images[0] 
                        : 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={property.propertyName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 
                                group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                      }}
                    />
                    
                    {/* Price tag */}
                    <div className="absolute top-4 right-4 bg-milk px-3 py-1 rounded-full 
                                  text-graphite font-medium text-sm shadow-sm">
                      KES {property.price?.toLocaleString()}/
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-transparent border-b border-lightstone">
                    {/* Location */}
                    <div className="flex items-center text-rustyred text-sm mb-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {property.location || 'Location unavailable'}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-milk mb-2">{property.propertyName}</h3>
                    
                    {/* View details button */}
                    <button className="text-sm text-rustyred hover:text-rustyred font-medium 
                                     transition-colors duration-300 flex items-center mt-1">
                      View details
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add CSS to hide scrollbar but allow scrolling
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;             /* Chrome, Safari and Opera */
  }
`;
document.head.appendChild(style);

export default FeaturedProperties;
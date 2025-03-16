import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FeaturedProperties = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  // Define property type
  interface Property {
    img: string;
    title: string;
    price: string;
    location: string;
  }

  // Sample property data (will be replaced with backend data)
  const properties: Property[] = [
    {
      img: "https://i.pinimg.com/736x/6c/8c/40/6c8c407f2137453a2862b4fc13ba6db9.jpg",
      title: "Modern Beachfront Villa",
      price: "499",
      location: "Bali, Indonesia"
    },
    {
      img: "https://i.pinimg.com/736x/c2/e3/e6/c2e3e6e0cb1ac12673adc1ae179785aa.jpg",
      title: "Luxury Mountain Retreat",
      price: "399",
      location: "Aspen, USA"
    },
    {
      img: "https://i.pinimg.com/736x/ec/37/0b/ec370bfb3649a826a95019534608690a.jpg",
      title: "Contemporary City Penthouse",
      price: "59900",
      location: "Tokyo, Japan"
    },
    {
      img: "https://town-n-country-living.com/wp-content/uploads/2023/10/rustic-porch.jpg",
      title: "Charming Country Estate",
      price: "45000",
      location: "Tuscany, Italy"
    },
    {
      img: "https://i.pinimg.com/originals/8c/ea/5d/8cea5d6961b13e9e99d36d5fc98acec9.jpg",
      title: "Oceanfront Paradise",
      price: "64900",
      location: "Phuket, Thailand"
    },
    {
      img: "https://coresites-cdn-adm.imgix.net/mpora_new/wp-content/uploads/2015/12/Mountain-Cabins-Swiss-Alps.jpg",
      title: "Alpine Cabin",
      price: "35000",
      location: "Swiss Alps"
    }
  ];

  useEffect(() => {
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

    // Auto-scroll animation for horizontal scroll
    if (scrollerRef.current) {
      const scrollWidth = scrollerRef.current.scrollWidth;
      const clientWidth = scrollerRef.current.clientWidth;
      
      // Only apply auto-scroll if content is wider than container
      if (scrollWidth > clientWidth) {
        // Create auto-scroll animation that loops
        const scrollTween = gsap.to(scrollerRef.current, {
          x: -(scrollWidth - clientWidth),
          ease: "none",
          duration: 20,
          scrollTrigger: {
            trigger: scrollerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            pin: false,
            invalidateOnRefresh: true,
          }
        });

        // Create hover effect to pause scrolling
        scrollerRef.current.addEventListener("mouseenter", () => {
          scrollTween.pause();
        });
        
        scrollerRef.current.addEventListener("mouseleave", () => {
          scrollTween.play();
        });

        // Clean up animation on unmount
        return () => {
          scrollTween.kill();
        };
      }
    }
  }, []);

  // Function to add card to refs
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
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
        
        {/* Horizontal scrolling container */}
        <div className="overflow-x-auto hide-scrollbar" ref={scrollerRef}>
          <div className="flex gap-6 pb-4 min-w-max">
            {properties.map((property, index) => (
              <div 
                key={index}
                ref={addToRefs}
                className="w-[300px] flex-shrink-0 rounded-lg overflow-hidden relative shadow-md 
                          group cursor-pointer transition-all duration-500 hover:shadow-xl "
              >
                {/* Image container with fixed aspect ratio */}
                <div className="relative pt-[66%]"> {/* 2:3 aspect ratio */}
                  <img 
                    src={property.img}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 
                              group-hover:scale-110"
                  />
                  
                  {/* Price tag */}
                  <div className="absolute top-4 right-4 bg-milk px-3 py-1 rounded-full 
                                text-graphite font-medium text-sm shadow-sm">
                    KES {property.price}/month
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 bg-transparent border-b border-lightstone">
                  {/* Location */}
                  <div className="flex items-center text-rustyred text-sm mb-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {property.location}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-milk mb-2">{property.title}</h3>
                  
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
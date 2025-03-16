import React, { useEffect, useRef } from 'react';
import { FaCompass, FaStar, FaFire, FaGem } from 'react-icons/fa';
import gsap from 'gsap';
import NewProperties from './NewProperties';
import TrendingProperties from './TrendingProperties';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';

interface RecommendationsProps {
  newProperties: Property[];
  trendingProperties: Property[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ 
  newProperties, 
  trendingProperties 
}) => {
  // Refs for animations
  const dividerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Fixed two-line engaging phrase
  const primaryPhrase = "If You Own It, Prove It";
const secondaryPhrase = "If You List It, Verify It";
  
  // Text animation setup for two-line phrase
  useEffect(() => {
    if (!textRef.current) return;
    
    // Clear previous content
    textRef.current.innerHTML = '';
    const textChars: HTMLSpanElement[] = [];
    
    // Create primary phrase container
    const primaryDiv = document.createElement('div');
    primaryDiv.className = 'text-milk text-4xl font-florssolid font-medium tracking-wide';
    textRef.current.appendChild(primaryDiv);
    
    // Create secondary phrase container
    const secondaryDiv = document.createElement('div');
    secondaryDiv.className = 'text-milk text-3xl font-florssolid font-normal tracking-wide mt-2';
    textRef.current.appendChild(secondaryDiv);
    
    // Create spans for primary phrase
    primaryPhrase.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(10px)';
      primaryDiv.appendChild(span);
      textChars.push(span);
    });
    
    // Create spans for secondary phrase
    secondaryPhrase.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(10px)';
      secondaryDiv.appendChild(span);
      textChars.push(span);
    });
    
    // Animate all characters with staggered timing
    const textAnimation = gsap.to(textChars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: "power2.out"
    });
    
    return () => {
      if (textAnimation) textAnimation.kill();
    };
  }, [primaryPhrase, secondaryPhrase]);
  
  return (
    <div className="container mx-auto">
      <section className="my-0">
        <NewProperties properties={newProperties} />
      </section>

      {/* Clean, professional divider section */}
      <div ref={dividerRef} className="relative ">
        {/* Wave SVG for top of divider */}
        <div className="w-full overflow-hidden">
          <svg 
            width="100%" 
            height="50" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
            className="w-full translate-y-1"
          >
            <path 
              d="M0,64 C360,0 720,120 1080,64 C1260,32 1440,64 1440,64 L1440,0 L0,0 Z" 
              fill="#F9F7F0"
            />
          </svg>
        </div>
        
        {/* Main content area with gradient background */}
        <div className="relative bg-gradient-to-r from-graphite/90 via-rustyred/30 to-graphite/20 py-4">
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 1440 200"
              preserveAspectRatio="none"
              className="absolute h-full w-full"
            >
              <path 
                d="M0,160 C320,100 640,190 960,130 C1280,70 1440,130 1440,130 L1440,200 L0,200 Z" 
                fill="#F9F7F0" 
                opacity="0.1" 
              />
              <path 
                d="M0,130 C320,70 640,160 960,100 C1280,40 1440,100 1440,100 L1440,200 L0,200 Z" 
                fill="#F9F7F0" 
                opacity="0.1" 
              />
            </svg>
          </div>
          
          {/* Text content - Modified for two-line phrase */}
          <div className="mx-auto max-w-7xl px-8 py-4 relative flex justify-center items-center gap-8">
            <div className="flex flex-col">
              <div ref={textRef} className="text-left">
                {/* Content will be dynamically populated in useEffect */}
              </div>
            </div>
            
            {/* Space for house illustration - now closer to text */}
            <div className="h-48">
              <img 
                src="https://storage.googleapis.com/web-vids/House%20searching-bro.svg" 
                alt="House searching illustration" 
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        {/* Wave SVG for bottom of divider */}
        <div className="w-full overflow-hidden">
          <svg 
            width="100%" 
            height="50" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
            className="w-full -translate-y-1"
          >
            <path 
              d="M0,0 C360,56 720,0 1080,56 C1260,84 1440,56 1440,56 L1440,120 L0,120 Z" 
              fill="#4A4947"
            />
          </svg>
        </div>
      </div>

      <section className="my-0">
        <TrendingProperties properties={trendingProperties} />
      </section>
    </div>
  );
};

export default Recommendations;
import React, { useState, useRef } from "react";

const MissionSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2; 
  const scrollRef = useRef<HTMLDivElement>(null);

  // Card data
  const cards = [
    {
      title: "Verified Property Listings",
      text: "Listings on the platform are verified and have a unique property ID—geofenced and secured on-chain.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    },
    {
      title: "Safe & Secure Payments",
      text: "Funds are held in escrow using smart contracts, ensuring no money moves until conditions are met. No fraud, no delays.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    {
      title: "Own Property in Shares",
      text: "Go in on real estate together—when your finances fall short, teamwork picks up the slack. Even if the friendship fades, the investment stays solid.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <path d="M2 17 L22 17 L22 19 L2 19 Z"/>
          <path d="M2 11 L22 11 L22 13 L2 13 Z"/>
          <path d="M2 5 L22 5 L22 7 L2 7 Z"/>
        </svg>
      )
    },
    {
      title: "Instant Property Search and KYC",
      text: "Be able to verify ownership, KYC details, and transaction history upfront—so you feel safe before making the transaction.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
          <path d="m8 11 2 2 4-4"/>
        </svg>
      )
    },
    {
      title: "Buy Property from Anywhere",
      text: "Now you no longer have to send your relatives to scout property while working abroad—invest securely from wherever you are, hassle-free.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <path d="M2 12h20"/>
        </svg>
      )
    }
  ];

 
  const goToSlide = (slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
      setCurrentSlide(slideIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          left: slideIndex * scrollRef.current.clientWidth,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <div className="bg-beige py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-florssolid text-dark mb-6">
            Real Estate That <span className="text-red">Moves</span> at the Speed of <span className="text-red">Crypto</span>
          </h2>
          <p className="text-lg text-dark/80">
            Our platform ensures secure, transparent transactions with smart contracts
            and escrow protection. We make it easier to trust through technology, reduce risks, and make property 
            transactions seamless, so you can invest with confidence.
          </p>
        </div>
        
      
        
        {/* Navigation controls */}
        <div className="flex justify-center mb-6 gap-2">
          <button 
            onClick={() => goToSlide(currentSlide - 1)}
            className={`p-2 rounded-full ${currentSlide === 0 ? 'bg-red/5 text-red/30' : 'bg-red/10 text-red hover:bg-red/20'} transition-colors`}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          {/* Indicator dots */}
          <div className="flex items-center gap-3 mx-4">
            {[...Array(totalSlides)].map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === index ? "bg-red scale-125" : "bg-red/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => goToSlide(currentSlide + 1)}
            className={`p-2 rounded-full ${currentSlide === totalSlides - 1 ? 'bg-red/5 text-red/30' : 'bg-red/10 text-red hover:bg-red/20'} transition-colors`}
            disabled={currentSlide === totalSlides - 1}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Carousel container */}
        <div className="relative overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
              width: "100%"
            }}
          >
            {/* First group of 3 cards */}
            <div className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.slice(0, 3).map((card, index) => (
                <div 
                  key={index}
                  className="bg-cream rounded-lg p-8 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold font-florssolid text-dark mb-3">{card.title}</h3>
                  <p className="text-dark/80">{card.text}</p>
                </div>
              ))}
            </div>
            
            {/* Second group of remaining cards */}
            <div className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.slice(3).map((card, index) => (
                <div 
                  key={index + 3}
                  className="bg-cream rounded-lg p-8 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold font-florssolid text-dark mb-3">{card.title}</h3>
                  <p className="text-dark/80">{card.text}</p>
                </div>
              ))}
              {/* Add an empty card if needed to maintain 3-column layout */}
              {cards.length % 3 > 0 && (
                <div className="hidden md:block"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
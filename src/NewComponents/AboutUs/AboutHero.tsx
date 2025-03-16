import React, { useEffect, useState } from "react";
import { Button } from "./UI/button";

const AboutHero = () => {
  const [showFirstLine, setShowFirstLine] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstLine(prev => !prev);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-cream py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6 relative h-[80px] md:h-[60px]">
              <span 
                className={`absolute transition-all duration-700 w-full ${
                  showFirstLine ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
                }`}
              >
                If you<span className="text-red"> Own</span> it,<span className="text-red"> Prove</span> it
              </span>
              <span 
                className={`absolute transition-all duration-700 w-full ${
                  showFirstLine ? "opacity-0 -translate-y-8" : "opacity-100 transform-none"
                }`}
              >
                If you<span className="text-red"> List</span> it,<span className="text-red"> Verify</span> it
              </span>
            </h1>
            <p className="text-lg text-dark/80 mb-8 max-w-2xl mx-auto lg:mx-0">
            Fraud happens when ownership isn’t clear. 
            Our on-chain verification ensures property owners and home seekers never second-guess a deal.
            </p>
            <Button className="bg-red hover:bg-red/90 text-cream px-8 py-6">
            Start with Confidence


            </Button>
          </div>

          <div className="flex-1 relative">
            <div className="aspect-[4/3] bg-beige/50 rounded-lg overflow-hidden relative">
              <div className="absolute top-5 right-5 h-20 w-20 bg-red/20 rounded-full"></div>
              <div className="absolute bottom-10 left-10 h-36 w-36 bg-red/10 rounded-full"></div>
              <div className="absolute bottom-20 right-20 h-24 w-24 bg-dark/10 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                alt="Our Team"
                className="w-full h-full object-cover object-center rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
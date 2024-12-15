import React, { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Header } from '../Header/Header';
import Recommendations from "../Recommendations/Recommendations";
import SearchBox from "../Recommendations/SearchBox/SearchBox";
import Footer from "../Footer/Footer";


export const LandingPage = () => {
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const handleExploreClick = () => {
    searchBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="h-screen w-full relative overflow-hidden">
        {/* Fallback Image */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000
                     ${isVideoLoading || videoError ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: "url('https://storage.googleapis.com/web-vids/frame0earthvid.png')",
          }}
        />
        
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000
                     ${isVideoLoading || videoError ? 'opacity-0' : 'opacity-100'}`}
          onLoadedData={() => setIsVideoLoading(false)}
          onError={() => setVideoError(true)}
        >
          <source src="https://storage.googleapis.com/web-vids/earth.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
          <div className="max-w-2xl px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-helvetica text-white leading-tight mb-6 animate-fade-in-up">
              Co-Own. Verify. Trace. <br />
              Verified Collateral.
            </h1>
            <p className="text-xl md:text-2xl font-helvetica-light text-white leading-relaxed mb-8 animate-fade-in-up delay-200">
              We're getting real about real estate. Your Gateway to Global Investing.
            </p>
            <button
              onClick={handleExploreClick}
              className="px-10 py-4 text-lg font-medium text-white border-2 border-[#B7e3cc] 
                       rounded-full transition-all duration-300 hover:bg-[#B7e3cc] hover:text-black
                       hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(183,227,204,0.3)]
                       active:translate-y-0 active:shadow-[0_2px_10px_rgba(183,227,204,0.2)]
                       tracking-wide animate-fade-in-up delay-400"
            >
              Explore
            </button>
          </div>
          <FaChevronDown 
            className="absolute bottom-8 text-white/80 animate-bounce w-6 h-6 cursor-pointer"
            onClick={handleExploreClick}
          />
        </div>
        <Header />
      </div>
      <div ref={searchBoxRef}>
        <SearchBox />
      </div>
      <Recommendations 
        newProperties={[]} 
        trendingProperties={[]}
      />
      <Footer />
    </div>
  );
};

export default LandingPage;
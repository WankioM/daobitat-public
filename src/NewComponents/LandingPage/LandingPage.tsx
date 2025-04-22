import React, { useRef, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Header } from '../Header/Header';
import Footer from "../Footer/Footer";
import FeaturedProperties from "../Recommendations/FeaturedProperties";
import LapImage from '../../Assets/lap.jpg';
import Recommendations from "../Recommendations/Recommendations";
import SearchBox from "../Recommendations/SearchBox/SearchBox";
import { Property } from '../ListerDashBoard/Properties/propertyTypes';
import { propertyService } from '../../services/propertyService';

export const LandingPage = () => {
  const featuredRef = useRef<HTMLDivElement>(null);
  const [newProperties, setNewProperties] = useState<Property[]>([]);
  const [trendingProperties, setTrendingProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch new properties
        const newResponse = await propertyService.getLatestProperties();
        if (newResponse.status === 'success' && Array.isArray(newResponse.data)) {
          setNewProperties(newResponse.data);
        }

        // Fetch trending properties
        const trendingResponse = await propertyService.getTrendingProperties(50);
        if (Array.isArray(trendingResponse.data)) {
          setTrendingProperties(trendingResponse.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleExploreClick = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-graphite via-graphite/90 to-graphite/60 relative overflow-hidden">
  {/* More obvious animated gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-stone/50 via-graphite to-rustyred/5 bg-[length:200%_100%] animate-gradient-x"></div>
      {/* Header */}
      <Header />

      {/* Hero Section - Takes up 100vh with Featured Properties at bottom */}
      <div className="relative h-[100vh] overflow-visible">
        {/* Main Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img 
            src={LapImage} 
            alt="Luxury accommodation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-graphite/90 via-graphite/75 to-graphite/60" />
        </div>
        
        {/* Hero Content - Positioned Higher */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-0 pb-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-florsoutline text-milk leading-tight mb-6">
              Why Wait?
            </h1>
            <h1 className="text-5xl md:text-6xl font-florssolid text-milk leading-tight mb-6">
              Own or rent now.
            </h1>
            
            <button
              onClick={handleExploreClick}
              className="px-10 py-4 text-lg font-medium text-graphite bg-milk 
                      rounded-full transition-all duration-300 border border-transparent
                      hover:border-rustyred hover:bg-milk/20 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Featured Properties at Bottom of Hero Section */}
        <div 
          ref={featuredRef} 
          className="absolute bottom-0 left-0 right-0 w-full"
          style={{ top: '65vh' }}
        >
          <FeaturedProperties />
        </div>

        {/* Scroll Indicator - Positioned Just Above Featured Properties */}
        <FaChevronDown 
          className="absolute left-1/2 -translate-x-1/2 text-milk/80 
                    animate-bounce w-6 h-6 cursor-pointer"
          style={{ bottom: 'calc(35vh + 16px)' }}
          onClick={handleExploreClick}
        />
      </div>

      {/* Spacer to push SearchBox down */}
      <div className="h-[30vh] bg-graphite/20"></div>

      {/* Rest of the Page Content */}
      <div className="bg-milk pt-45">
        {/* Search Box */}
        <div className="w-full bg-lightstone ">
          <SearchBox />
        </div>

        {/* New and Trending Properties */}
        <Recommendations 
          newProperties={newProperties}
          trendingProperties={trendingProperties}
        />
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
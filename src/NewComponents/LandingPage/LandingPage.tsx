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
    <div className="flex flex-col min-h-screen ">
      {/* Header */}
      <Header />

      {/* Hero Section - Takes up 2/3 of viewport height */}
      <div className="relative h-[calc(67vh)] ">
        {/* Main Image */}
        <div className="relative w-full h-full">
          <img 
            src={LapImage} 
            alt="Luxury accommodation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/60 to-graphite/30" />
          
          {/* Hero Content - Centered */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-helvetica text-milk leading-tight mb-6">
                Find Home. Feel Home
              </h1>
              <p className="text-xl md:text-2xl font-helvetica-light text-milk/90 leading-relaxed mb-8">
                We Make Property Search Easy & Secure.
              </p>
              <button
                onClick={handleExploreClick}
                className="px-10 py-4 text-lg font-medium text-milk bg-desertclay 
                         rounded-full transition-all duration-300 hover:bg-lightstone
                         hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <FaChevronDown 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-milk/80 
                       animate-bounce w-6 h-6 cursor-pointer"
            onClick={handleExploreClick}
          />
        </div>
      </div>

      {/* Properties Sections */}
      <div className="bg-milk">
        {/* Featured Properties */}
        <div ref={featuredRef}>
          <FeaturedProperties />
        </div>

        {/* Search Box */}
        <div className=" w-full bg-lightstone">
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
import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';
import { useUser } from '../../NewContexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface HeroPropertyCardProps {
  property: Property;
  onClick?: (propertyId: string) => void;
  onWishlistUpdate: (propertyId: string, action: 'add' | 'remove') => void;
}

const HeroPropertyCard: React.FC<HeroPropertyCardProps> = ({ 
  property,
  onClick,
  onWishlistUpdate 
}) => {
  const { user, updateUserWishlist } = useUser();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if the property is in user's wishlist
    if (user && user.wishlist) {
      setIsInWishlist(user.wishlist.includes(property._id));
    }
  }, [user, property._id]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    // Prevent the card click event from triggering
    e.stopPropagation();
    
    if (!user) {
      // Show login prompt
      const shouldLogin = window.confirm('You need to be logged in to add properties to your wishlist. Would you like to log in?');
      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    try {
      const action = isInWishlist ? 'remove' : 'add';
      await updateUserWishlist(property._id, action);
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };
  
  const handleCardClick = () => {
    // Track the click if onClick handler is provided
    if (onClick) {
      onClick(property._id);
    }
    
    // Navigate to the property details page
    navigate(`/property-details/${property._id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={property.images?.[0] || '/default-property-image.jpg'} 
            alt={property.propertyName}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 ${
            isInWishlist ? 'text-licorice' : 'text-gray-400'
          }`}
        >
          <FaHeart size={20} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
          {property.propertyName}
        </h3>
        <p className="text-gray-600 mb-4 truncate" title={property.location}>
          {truncateText(property.location, 40)}
        </p>
        
        <div className="flex justify-between items-center text-gray-700">
          <div className="flex items-center gap-4">
            <span>{property.bedrooms} beds</span>
            <span>{property.bathrooms} baths</span>
            <span>{property.space}m²</span>
          </div>
          <span className="text-xl font-semibold text-licorice">
            ${property.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroPropertyCard;
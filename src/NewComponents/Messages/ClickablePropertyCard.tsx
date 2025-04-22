import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types/common';
import { getMongoId } from '../../utils/mongoUtils';
import { FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';

interface ClickablePropertyCardProps {
  property: Property;
  offerId?: string;
  className?: string;
}

const ClickablePropertyCard: React.FC<ClickablePropertyCardProps> = ({ 
  property,
  offerId,
  className = ''
}) => {
  const navigate = useNavigate();
  
  // Get the property ID as a string
  const propertyId = typeof property._id === 'string' 
    ? property._id 
    : getMongoId(property._id);
  
  // Handle click on the property card
  const handleClick = () => {
    if (propertyId) {
      navigate(`/offer/${offerId}`);
    }
  };
  
  // Get the first image or fallback
  const propertyImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : '/placeholder-property.jpg';
  
  // Format price with proper currency symbol
  const formatPrice = (price?: number, currency = 'USD') => {
    if (price === undefined || price === null) {
      return '';  // Return empty string instead of "Price not available"
    }
    
    const symbolMap: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KSh',
    };
    
    const symbol = symbolMap[currency] || '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  // Get price information safely
  const displayPrice = formatPrice(property.price);

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer max-w-xs ${className}`}
      onClick={handleClick}
    >
      {/* Property Image - 4x smaller height and reduced width */}
      <div className="relative h-12 w-20 overflow-hidden">
  <img 
    src={propertyImage} 
    alt={property.propertyName} 
    className="w-full h-full object-contain transition-transform hover:scale-105 duration-300"
  />
</div>
      
     
    </div>
  );
};

export default ClickablePropertyCard;
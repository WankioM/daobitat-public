import React from 'react';
import './PropertyCard.css';
import { FaHome } from 'react-icons/fa';
import blockchainImg from '../../../Assets/blockchain.png';

interface PropertyCardProps {
  images?: string[];
  specificType?: string;
  action?: string;
  price?: string;
  space?: string;
  bedrooms?: number;
  bathrooms?: number;
  features?: string;
  security?: string;
  furnished?: boolean;
  pool?: boolean;
  gym?: boolean;
  garden?: boolean;
  parking?: boolean;
  propertyName?: string;
  propertyType?: string;
  unitNo?: string;
  location?:string;
  additionalComments?: string;
  cryptoaccepted: boolean;
  daoenabled: false;
}

const PropertyCard: React.FC<PropertyCardProps & { onClick: () => void }> = ({
  images = [],
  specificType,
  action,
  price,
  space,
  bedrooms,
  bathrooms,
  features,
  security,
  furnished,
  pool,
  gym,
  garden,
  parking,
  propertyName,
  propertyType,
  unitNo,
  location,
  additionalComments,
  cryptoaccepted,
  daoenabled,
  onClick,
}) => {
  // Check if images array is defined and not empty
  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <div className="property-card" onClick={onClick}>
      <div className="image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={propertyName} className="property-image" />
        ) : (
          <FaHome size={50} color="#ccc" />
        )}
        {daoenabled && (
          <div className="dao-overlay">
            <img src={blockchainImg} alt="DAO Enabled" className="dao-icon" style={{ width: '40px', height: 'auto' }}  />
          </div>
        )}
      </div>

      <div className="property-info">
        <div className="line-one">
          {bedrooms ? `${bedrooms} bds` : ''} {bathrooms ? `| ${bathrooms} ba` : ''} 
          {space ? `| ${space} sqft` : ''} - {action || ''}
        </div>
        <div className="line-two">
          {propertyName ? `${propertyName}` : ''}, {location || ''}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

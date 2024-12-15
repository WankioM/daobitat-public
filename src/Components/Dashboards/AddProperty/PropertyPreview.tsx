import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './PropertyPreview.css';

const PropertyPreview: React.FC<{ property: any; onClose: () => void }> = ({ property, onClose }) => {
  const {
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
  } = property;

  return (
    <div className="property-focus-container">
      <div className="property-focus-content">
        <button onClick={onClose} className="close-button">
          <FaTimes size={30} />
        </button>
        <div className="property-focus-images">
          {images.map((image: string, index: number) => (
            <img key={index} src={image} alt={`${propertyName} image ${index + 1}`} />
          ))}
        </div>
        <div className="property-focus-details">
          <h2>{propertyName}</h2>
          <p>{specificType}</p>
          <p>Price: {price}</p>
          <p>Space: {space} sqft</p>
          <p>{bedrooms} bds | {bathrooms} ba</p>
          <p>Location: {location}</p>
          <p>Property Type: {propertyType}</p>
          <p>Unit No: {unitNo}</p>
          <p>Features: {features.join(', ')}</p>
          <p>Security: {security}</p>
          <p>Furnished: {furnished ? 'Yes' : 'No'}</p>
          <p>Pool: {pool ? 'Yes' : 'No'}</p>
          <p>Gym: {gym ? 'Yes' : 'No'}</p>
          <p>Garden: {garden ? 'Yes' : 'No'}</p>
          <p>Parking: {parking}</p>
          <p>Additional Comments: {additionalComments}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreview;

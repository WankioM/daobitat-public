import React from 'react';

interface PropertyReferenceProps {
  propertyName: string;
  propertyType: string;
  propertyLocation: string;
}

const PropertyReference: React.FC<PropertyReferenceProps> = ({ propertyName, propertyType, propertyLocation }) => {
  return (
    <div className="property-reference">
      <h4>Property Reference</h4>
      <p><strong>Name:</strong> {propertyName}</p>
      <p><strong>Type:</strong> {propertyType}</p>
      <p><strong>Location:</strong> {propertyLocation}</p>
    </div>
  );
};

export default PropertyReference;

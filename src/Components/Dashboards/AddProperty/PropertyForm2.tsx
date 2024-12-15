
import React from 'react';

interface PropertyForm2Props {
  nextStep: () => void;
  prevStep: () => void;
  location: string;
}

const PropertyForm2: React.FC<PropertyForm2Props> = ({ nextStep, prevStep, location }) => {

  // Encode location for use in the Google Maps URL
  console.log('Location:', location);

  const encodedLocation = encodeURIComponent(location);
  console.log('encode Location:', encodedLocation);

  const googleMapsURL = `https://www.google.com/maps/embed/v1/place?q=${encodedLocation}&key=AIzaSyBf6lk3_tIXcIHkB5Zr_R4y7jWGaTGItf4`;
  return (
    <div className="property-form">
      <h2>Is this the correct location?</h2>
      <iframe
        width="600"
        height="400"
        
        style={{ border: 0 }}
        src={googleMapsURL}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
      ></iframe>
      <form>
        
        <button type="button" onClick={prevStep}>No</button>
        <button type="button" onClick={nextStep}>Yes</button>
      </form>
    </div>
  );
};

export default PropertyForm2;

// src/components/PropertyFormContainer.tsx
import React, { useState } from 'react';
import PropertyForm from './PropertyForm';
import PropertyForm2 from './PropertyForm2';
import PropertyForm3 from './PropertyForm3';
import PropertyForm4 from './PropertyForm4';

interface PropertyFormContainerProps {
  handleCloseForm: () => void;
}


const PropertyFormContainer: React.FC<PropertyFormContainerProps> = ({ handleCloseForm }) => {
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [propertyAction, setPropertyAction] = useState(''); 
  const [documentId, setDocumentId] = useState<string >('');
  const [listOnChain, setListOnChain] = useState(false);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);
  const [location, setLocation] = useState(''); 

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };
  const handlePropertyTypeChange = (type: string) => {
    setPropertyType(type);
  };

  const handleListOnChain = () => {
    setListOnChain(true);
    nextStep();
  };

  const handleSubmitForm3 = () => {
   
    handleCloseForm();
  };

 

  return (
    <div>
      {step === 1 && (
        <PropertyForm
          nextStep={nextStep}
          onLocationChange={handleLocationChange}
          onPropertyTypeChange={handlePropertyTypeChange}
          setDocumentId={setDocumentId}
        />
      )}
      {step === 2 && (
        <PropertyForm2
          nextStep={nextStep}
          prevStep={prevStep}
          location={location}
        />
      )}
      {step === 3 && (
        <PropertyForm3
          prevStep={prevStep}
          propertyType={propertyType}
          propertyAction={propertyAction}
          documentId={documentId}
          handleCloseForm={handleCloseForm}
          handleListOnChain={handleListOnChain}
          handleSubmitForm3={handleSubmitForm3}
        />
      )}
      {step === 4 && listOnChain && (
        <PropertyForm4
          prevStep={prevStep}
          handleCloseForm={handleCloseForm}
          documentId={documentId}
        />
      )}
    </div>
  );
};

export default PropertyFormContainer;

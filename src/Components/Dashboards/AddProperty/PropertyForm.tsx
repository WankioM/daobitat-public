// src/components/PropertyForm.tsx
import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { firestore } from '../../../firebaseConfig';
import { collection, doc, addDoc } from 'firebase/firestore';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';
import './PropertyForm.css';

interface CustomSuggestion extends Suggestion {
  active?: boolean;  // Mark as optional to avoid TypeScript errors
}

interface PropertyFormProps {
  nextStep: () => void;
  onLocationChange: (location: string) => void;
  onPropertyTypeChange: (type: string) => void;
  setDocumentId: (documentId: string) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ nextStep, onLocationChange, onPropertyTypeChange, setDocumentId }) => {
  const { user } = useUser();
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    location: '',
    streetAddress: '',
    propertyType: '',
    unitNo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPropertyData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelect = (address: string, placeId: string) => {
    setPropertyData((prevState) => ({
      ...prevState,
      location: address
    }));
    onLocationChange(address);  // Use the function prop
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setPropertyData((prevState) => ({
      ...prevState,
      propertyType: type
    }));
    onPropertyTypeChange(type); // Notify parent component of type change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userDoc = doc(firestore, 'users', user.uid);
      const propertiesCollection = collection(userDoc, 'properties');
      

      const docRef = await addDoc(propertiesCollection, propertyData);

      // Save the document ID in a state or context to use later
      setDocumentId(docRef.id);
     
      nextStep(); 
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property');
    }
  };

  return (
    <div className="property-form">
      <h2>Add Your Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="propertyName">Property Name (optional)</label>
          <input
            type="text"
            id="propertyName"
            name="propertyName"
            value={propertyData.propertyName}
            onChange={handleChange}
            placeholder="Enter property name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <PlacesAutocomplete
            value={propertyData.location}
            onChange={(value) => setPropertyData((prevState) => ({ ...prevState, location: value }))}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Search Location...',
                    className: 'location-search-input',
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const customSuggestion = suggestion as CustomSuggestion;
                    const className = customSuggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    return (
                      <div
                        key={customSuggestion.placeId}
                        {...getSuggestionItemProps(customSuggestion, {
                          className,
                        })}
                      >
                        <span>{customSuggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div className="form-group">
          <label htmlFor="streetAddress">Street Address (optional)</label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={propertyData.streetAddress}
            onChange={handleChange}
            placeholder="Enter street address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={propertyData.propertyType}
            onChange={handlePropertyTypeChange}
            required
          >
            <option value="" disabled>Select property type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Special-purpose">Special-purpose</option>
            <option value="Vacation/Short-term rentals">Vacation/Short-term rentals</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="unitNo">Unit No. (if applicable)</label>
          <input
            type="text"
            id="unitNo"
            name="unitNo"
            value={propertyData.unitNo}
            onChange={handleChange}
            placeholder="Enter unit number"
          />
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default PropertyForm;

import React, { useState, useEffect , useCallback} from 'react';
import PropertyFormContainer from './PropertyFormContainer';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore, storage } from '../../../firebaseConfig';
import PropertyCard from './PropertyCard';
import PropertyFocus from './PropertyFocus';
import { useUser } from '../../../contexts/UserContext';

import './Properties.css';


const Properties: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { user } = useUser();
  

  const handleAddProperty = () => {
    setShowForm(true);
  };

  const handleCardClick = (property: any) => {
    setSelectedProperty(property);
    console.log(`Selected: ${property}`)
  };

  const handleCloseFocus = () => {
    setSelectedProperty(null);
  };

  

  const fetchProperties = useCallback(async () => {
    try {
      const userUid = user.uid;
      const propertiesRef = collection(firestore, 'users', userUid, 'properties');
      const propertiesSnapshot = await getDocs(propertiesRef);
      const propertiesList = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propertiesList);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleCloseForm = () => {
    setShowForm(false);
    fetchProperties(); 
  };

  return (
    <div className="properties-container">
      <h2>Your Properties</h2>
      <div className="property-cards">
        {properties.map(property => (
          <PropertyCard 
          key={property.id} {...property}
          onClick={() => handleCardClick(property)} />
        ))}
      </div>
      <button className="add-property-button" onClick={handleAddProperty}>
        Add Property
      </button>
      {showForm && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-button" onClick={handleCloseForm}>
              &times;
            </button>
            <PropertyFormContainer handleCloseForm={handleCloseForm} />
          </div>
        </div>
      )}

      {selectedProperty && (
        <PropertyFocus property={selectedProperty} onClose={handleCloseFocus} />
      )}
      
    </div>
  );
};

export default Properties;

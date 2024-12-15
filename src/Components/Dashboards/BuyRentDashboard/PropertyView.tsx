import React, { useEffect, useState } from 'react';
import PropertyCard from '../AddProperty/PropertyCard';
import { firestore } from '../../../firebaseConfig';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';

interface PropertyViewProps {
  propertyId: any; 
}

const PropertyView: React.FC<PropertyViewProps> = ({ propertyId }) => {
  const [property, setProperty] = useState<any>(null);

  console.log(`Property ID... : ${propertyId}`);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch all users from Firestore
        const usersRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        // Iterate through each user's properties to find the matching propertyId
        for (const userDoc of usersSnapshot.docs) {
          const propertiesRef = collection(userDoc.ref, 'properties');
          const propertyQuery = query(propertiesRef, where('__name__', '==', propertyId));
          const propertySnapshot = await getDocs(propertyQuery);

          if (!propertySnapshot.empty) {
            // If a matching property is found, set it to state and stop the loop
            setProperty(propertySnapshot.docs[0].data());
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (!property) return <div>Loading property details...</div>;

  return (
    <div className="property-view">
      <h3>Property Details</h3>
      <p><strong>Location:</strong> {property.location}</p>
      <PropertyCard {...property} />
    </div>
  );
};

export default PropertyView;

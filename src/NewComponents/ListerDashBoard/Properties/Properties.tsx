import React, { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { IoAddCircleOutline } from 'react-icons/io5';
import { AddPropertyModal } from './Forms/AddPropertyModal';
import { propertyService } from '../../../services/propertyService';

const Properties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await propertyService.getUserProperties();
      setProperties(response.data.data || []);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debugFetchProperties = async () => {
      try {
        console.log("=========== FETCHING PROPERTIES ===========");
        console.log("Token:", localStorage.getItem('token')?.substring(0, 20) + '...');
        
        console.log("About to call propertyService.getUserProperties()");
        const response = await propertyService.getUserProperties();
        
        console.log("Successfully fetched properties:", response.data);
        setProperties(response.data.data || []);
      } catch (err: any) {
        console.error('DETAILED Error fetching properties:', err);
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Error setting up request:', err.message);
        }
        
        setError('Failed to load properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    debugFetchProperties();
  }, []);

  const handlePropertyAdded = () => {
    fetchProperties(); // Refresh the properties list
    setIsModalOpen(false); // Close the modal after successful addition
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await propertyService.deleteProperty(propertyId);
      // Refresh the properties list after successful deletion
      fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center">
        <div className="text-slategray">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slategray">My Properties</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-celadon text-slategray px-4 py-2 rounded-lg
                    hover:bg-opacity-90 transition-colors duration-300"
        >
          <IoAddCircleOutline size={20} />
          <span>Add Property</span>
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No properties found. Click "Add Property" to create your first listing.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property._id} 
              property={property}
              onDelete={handleDeleteProperty}
              onPropertyUpdated={fetchProperties}
            />
          ))}
        </div>
      )}

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </div>
  );
};

export default Properties;
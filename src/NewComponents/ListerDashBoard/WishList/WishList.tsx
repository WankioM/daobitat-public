import React, { useState, useEffect } from 'react';
import { useUser } from '../../../NewContexts/UserContext';
import { Property } from '../Properties/propertyTypes';
import { propertyService } from '../../../services/propertyService';
import HeroPropertyCard from '../../Recommendations/HeroPropertyCard';
import { FaSpinner } from 'react-icons/fa';

const WishList: React.FC = () => {
  const { user, updateUserWishlist } = useUser();
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProperties = async () => {
      try {
        setLoading(true);
        console.log('Current user:', user);
        console.log('Wishlist:', user?.wishlist);

        if (!user?.wishlist?.length) {
          console.log('No properties in wishlist');
          setWishlistProperties([]);
          return;
        }

        console.log('Fetching properties for wishlist:', user.wishlist);
        // Fetch all wishlist properties in parallel
        const propertyPromises = user.wishlist.map(async (propertyId) => {
          try {
            console.log('Fetching property:', propertyId);
            const { data } = await propertyService.getPropertyById(propertyId);
            console.log('Fetched property data:', data);
            return data;
          } catch (error) {
            console.error(`Error fetching property ${propertyId}:`, error);
            return null;
          }
        });

        const properties = await Promise.all(propertyPromises);
        const validProperties = properties.filter((p): p is Property => p !== null);
        console.log('Valid properties fetched:', validProperties);
        setWishlistProperties(validProperties);
      } catch (error) {
        console.error('Error fetching wishlist properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProperties();
  }, [user?.wishlist]);

  const handleWishlistUpdate = async (propertyId: string, action: 'add' | 'remove') => {
    try {
      await propertyService.updateWishlist(propertyId, action);
      updateUserWishlist(propertyId, action);
      
      if (action === 'remove') {
        setWishlistProperties(prev => prev.filter(p => p._id !== propertyId));
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handlePropertyClick = async (propertyId: string) => {
    try {
      await propertyService.incrementPropertyClicks(propertyId);
    } catch (error) {
      console.error('Error incrementing property clicks:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-celadon" />
      </div>
    );
  }

  if (!wishlistProperties.length) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500">
          Start adding properties to your wishlist by clicking the heart icon on properties you like!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistProperties.map((property) => (
          <HeroPropertyCard
            key={property._id}
            property={property}
            onWishlistUpdate={(propertyId) => handleWishlistUpdate(propertyId, 'remove')}
            onClick={handlePropertyClick}
          />
        ))}
      </div>
    </div>
  );
};

export default WishList;

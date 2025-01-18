import React, { useState } from 'react';
import { FaHandshake } from 'react-icons/fa';
import MessageOwner from '../MessageOwner';
import MakeOfferModal from '../../PaymentFlow/Offer/MakeOfferModal';

interface PropertyActionsProps {
  propertyId: string;
  propertyName: string;
  ownerId: string;
  ownerName: string;
  price: number;
  currency: string;
}

const PropertyActions: React.FC<PropertyActionsProps> = ({
  propertyId,
  propertyName,
  ownerId,
  ownerName,
  price,
  currency
}) => {
  const [showOfferModal, setShowOfferModal] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      <MessageOwner
        propertyId={propertyId}
        propertyName={propertyName}
        ownerId={ownerId}
        ownerName={ownerName}
      />
      
      <button
        onClick={() => setShowOfferModal(true)}
        className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-celadon text-celadon py-3 px-4 rounded-lg hover:bg-celadon hover:text-white transition-all duration-300 font-medium"
      >
        <FaHandshake className="text-lg" />
        <span>Make an Offer</span>
      </button>

      <MakeOfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyName={propertyName}
        propertyId={propertyId}
        ownerId={ownerId}
        listingPrice={price}
        currency={currency}
      />
    </div>
  );
};

export default PropertyActions;
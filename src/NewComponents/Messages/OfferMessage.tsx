
import React from 'react';
import { Message } from './types';

interface OfferMessageProps {
  message: Message;
  isOwn: boolean;
}

const OfferMessage: React.FC<OfferMessageProps> = ({ message, isOwn }) => {
  const { offerDetails } = message;
  if (!offerDetails) return null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-sm rounded-lg overflow-hidden shadow-lg 
                      ${isOwn ? 'bg-celadon/10' : 'bg-white'}`}>
        {/* Property Image */}
        {offerDetails.propertyImage && (
          <img 
            src={offerDetails.propertyImage} 
            alt="Property"
            className="w-full h-32 object-cover"
          />
        )}
        
        {/* Offer Details */}
        <div className="px-4 py-3">
          <div className="font-bold text-lg mb-2">Rental Offer</div>
          
          {/* Status Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                          ${getStatusColor(offerDetails.status)} mb-3`}>
            {offerDetails.status.charAt(0).toUpperCase() + offerDetails.status.slice(1)}
          </div>
          
          {/* Offer Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent:</span>
              <span className="font-semibold">
                {offerDetails.currencySymbol}{offerDetails.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{offerDetails.duration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Deposit:</span>
              <span className="font-semibold">
                {offerDetails.currencySymbol}{offerDetails.securityDeposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Move-in Date:</span>
              <span className="font-semibold">
                {new Date(offerDetails.moveInDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
    withdrawn: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return colors[status as keyof typeof colors] || colors.pending;
};

export default OfferMessage;
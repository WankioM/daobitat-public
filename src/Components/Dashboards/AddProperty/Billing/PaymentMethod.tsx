import React, { useState } from 'react';
import ConnectWallet from './ConnectWallet';
import ConnectBaseSmartWallet from './ConnectSmartWallet';
import PageInConstruction from '../../../InConstruction/PageInconstruction';
import './PaymentMethod.css';

interface PayProps {}

const PaymentMethod: React.FC<PayProps> = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleUnderConstructionClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="paydiv">
      <h2>Select Payment Method</h2>
      <div className="payment-options">
        <button onClick={handleUnderConstructionClick} className="payment-button visa">
          Visa
        </button>
        <button onClick={handleUnderConstructionClick} className="payment-button paypal">
          PayPal
        </button>
        <button onClick={handleUnderConstructionClick} className="payment-button mastercard">
          Mastercard
        </button>
        <ConnectWallet />
        <ConnectBaseSmartWallet  />
      </div>
      {showPopup && <PageInConstruction onClose={closePopup} />}
    </div>
  );
};

export default PaymentMethod;
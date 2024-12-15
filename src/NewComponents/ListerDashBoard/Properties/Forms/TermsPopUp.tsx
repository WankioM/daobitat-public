import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface TermsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsPopup: React.FC<TermsPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] pr-4">
          <h2 className="text-2xl font-bold mb-6">DAO-Bitat Property Listing Terms and Conditions</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-bold mb-2">1. Irreversible Action</h3>
              <p>Once you confirm the listing of your property on DAO-Bitat, this action cannot be undone. Your property can only be removed from the platform by DAO-Bitat if it fails to meet our terms and conditions or listing standards.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">2. Escrow Funds</h3>
              <p>All funds received from buyers will be held in escrow until the entire share of the property is purchased. This ensures that transactions are secure and that all parties are protected until the property ownership is fully transferred.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-2">3. Governance Rights</h3>
              <p>Once a property is purchased, the buyers gain the right to participate in decision-making regarding the property. This means they can vote on any governance issues related to the property.</p>
            </section>

            {/* More sections following the same pattern... */}
            
            <section>
              <h3 className="text-lg font-bold mb-2">10. Privacy and Data Security</h3>
              <p>Your personal information and property details will be handled in accordance with DAO-Bitat's privacy policy. We are committed to protecting your data and ensuring it is used only for the purposes of facilitating the property sale.</p>
            </section>

            <div className="mt-8 pt-4 border-t">
              <p className="text-sm text-gray-600">By checking the terms and conditions box, you acknowledge that you have read, understood, and agreed to these terms and conditions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPopup;
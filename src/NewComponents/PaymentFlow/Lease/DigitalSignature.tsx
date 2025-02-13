import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface DigitalSignatureProps {
  onSign: (signature: string) => void;
  onBack: () => void;
}

const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onSign, onBack }) => {
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const signaturePadRef = useRef<SignatureCanvas>(null);

  const handleConfirmSignature = () => {
    if (signatureType === 'draw' && signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      onSign(signatureData);
    } else {
      onSign(typedSignature);
    }
  };

  const clearSignature = () => {
    if (signatureType === 'draw' && signaturePadRef.current) {
      signaturePadRef.current.clear();
    } else {
      setTypedSignature('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Digital Signature</h1>

      {/* Signature Type Toggle */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mr-2 rounded-lg ${
            signatureType === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSignatureType('type')}
        >
          Type Signature
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            signatureType === 'draw' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSignatureType('draw')}
        >
          Draw Signature
        </button>
      </div>

      {/* Signature Input Area */}
      <div className="mb-8">
        {signatureType === 'type' ? (
          <div className="space-y-4">
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-600">
              By typing your name above, you agree that this constitutes your legal signature.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-lg">
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  className: 'signature-canvas w-full h-64 rounded-lg',
                }}
                backgroundColor="white"
              />
            </div>
            <p className="text-sm text-gray-600">
              Draw your signature using your mouse or touch screen.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mr-4"
          >
            Back to Preview
          </button>
          <button
            onClick={clearSignature}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        </div>
        <button
          onClick={handleConfirmSignature}
          disabled={signatureType === 'type' ? !typedSignature : false}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm & Sign
        </button>
      </div>
    </div>
  );
};

export default DigitalSignature;

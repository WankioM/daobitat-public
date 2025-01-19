import React, { useState } from 'react';
import { FaCreditCard, FaLock } from 'react-icons/fa';

interface CardPaymentProps {
  amount: number;
  offerId: string;
  onSuccess: () => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({ amount, onSuccess, offerId }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  const formatCardNumber = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiry = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substr(0, 2) + '/' + numbers.substr(2, 2);
    }
    return numbers;
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4">
        <FaCreditCard className="text-3xl text-celadon" />
        <div>
          <h3 className="font-semibold text-lg">Card Payment</h3>
          <p className="text-sm text-gray-600">Pay using credit or debit card</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount to Pay</span>
          <span className="font-semibold">${amount.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="text"
              value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVC</label>
            <input
              type="text"
              value={cvc}
              onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
              maxLength={3}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-celadon focus:border-transparent"
            required
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaLock />
          <span>Your payment is secured by 256-bit encryption</span>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 bg-celadon text-white rounded-lg hover:bg-opacity-90 
                   disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default CardPayment;
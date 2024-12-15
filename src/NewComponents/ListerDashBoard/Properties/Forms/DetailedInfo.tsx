import React from 'react';
import { motion } from 'framer-motion';
import { FaBed } from 'react-icons/fa';
import { StepProps, NewPropertyFormData } from '../propertyTypes';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const amenities = ['furnished', 'pool', 'gym', 'garden', 'parking'] as const;
type AmenityKey = typeof amenities[number];

const currencies = [
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'BNB', name: 'Binance Coin' },
  { code: 'XRP', name: 'Ripple' },
  { code: 'ADA', name: 'Cardano' },
  { code: 'USDT', name: 'Tether' },
  { code: 'USDC', name: 'USD Coin' },
  { code: 'BUSD', name: 'Binance USD' },
  { code: 'DAI', name: 'Dai' },
  { code: 'TUSD', name: 'TrueUSD' },
];

export const DetailedInfo: React.FC<StepProps> = ({ formData, setFormData }) => (
  <motion.div 
    className="space-y-4"
    variants={fadeIn}
    initial="hidden"
    animate="visible"
  >
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Bedrooms</label>
        <input
          type="number"
          name="bedrooms"
          value={formData.bedrooms}
          onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          min="0"
        />
      </div>
      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Price</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
            className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
            min="0"
          />
          <select
            value={formData.currency || 'KES'}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
            className="w-32 p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          >
            {currencies.map(currency => (
              <option 
                key={currency.code} 
                value={currency.code}
              >
                {currency.code}
              </option>
            ))}
          </select>
        </div>
        {!formData.currency && (
          <p className="text-sm text-gray-500 mt-1">
            Recommended: KES (Kenyan Shilling)
          </p>
        )}
      </div>
    </div>

    <div>
      <label className="font-helvetica-regular text-slategray block mb-2">Action</label>
      <select
        value={formData.action}
        onChange={(e) => setFormData(prev => ({...prev, action: e.target.value}))}
        className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
      >
        <option value="">Select action</option>
        <option value="for sale">For Sale</option>
        <option value="for rent">For Rent</option>
        <option value="for coown">For Co-ownership</option>
        <option value="for collateral">For Collateral</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div>
      <label className="font-helvetica-regular text-slategray block mb-2">Space (m²)</label>
      <input
        type="number"
        min="0"
        value={formData.space}
        onChange={(e) => setFormData(prev => ({...prev, space: Number(e.target.value)}))}
        className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
        placeholder="Enter space in square meters"
      />
    </div>

    <div>
      <label className="font-helvetica-regular text-slategray block mb-2">Amenities</label>
      <div className="grid grid-cols-2 gap-2">
        {amenities.map(amenity => (
          <label key={amenity} className="flex items-center space-x-2">
            <input
              type="checkbox" 
              checked={formData.amenities[amenity]}
              onChange={() => setFormData({
                ...formData,
                amenities: {
                  ...formData.amenities,
                  [amenity]: !formData.amenities[amenity]
                }
              })}
              className="text-celadon"
            />
            <span className="font-helvetica-light text-slategray">
              {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <FaBed className="text-celadon text-xl" />
      <span className="font-helvetica-light text-slategray">Step 3 of 4</span>
    </div>
  </motion.div>
);
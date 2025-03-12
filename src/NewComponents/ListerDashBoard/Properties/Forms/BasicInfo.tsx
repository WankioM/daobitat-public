import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaMapMarkedAlt } from 'react-icons/fa';
import { NewPropertyFormData, StepProps } from '../propertyTypes';
import { PROPERTY_TYPES, SPECIFIC_TYPES } from './propertyConstants';

export const BasicInfo: React.FC<StepProps> = ({ formData, setFormData }) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Property Name*</label>
        <input
          type="text"
          value={formData.propertyName}
          onChange={(e) => setFormData(prev => ({...prev, propertyName: e.target.value}))}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          placeholder="Enter property name"
          required
        />
      </div>

      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Property Type*</label>
        <select
          value={formData.propertyType}
          onChange={(e) => {
            const propertyType = e.target.value as NewPropertyFormData['propertyType'];
            setFormData(prev => ({
              ...prev,
              propertyType,
              specificType: SPECIFIC_TYPES[propertyType]?.[0] || '' // Set first specific type as default
            }));
          }}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          required
        >
          <option value="">Select type</option>
          {PROPERTY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {formData.propertyType && (
        <div>
          <label className="font-helvetica-regular text-slategray block mb-2">Specific Type*</label>
          <select
            value={formData.specificType}
            onChange={(e) => setFormData(prev => ({...prev, specificType: e.target.value}))}
            className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
            required
          >
            <option value="">Select specific type</option>
            {SPECIFIC_TYPES[formData.propertyType].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="font-helvetica-regular text-slategray block mb-2">Unit No. (if applicable)</label>
        <input
          type="text"
          value={formData.unitNo}
          onChange={(e) => setFormData(prev => ({...prev, unitNo: e.target.value}))}
          className="w-full p-2 border border-gray-200 rounded-lg focus:border-celadon outline-none"
          placeholder="E.g., Apt 4B, Unit 201"
        />
      </div>

      {formData.streetAddress ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <FaMapMarkedAlt className="text-celadon mt-1 mr-2" />
            <div>
              <p className="font-helvetica-regular text-slategray">Initial Address:</p>
              <p className="font-helvetica-light text-sm text-gray-600">{formData.streetAddress}</p>
              <p className="text-xs text-gray-500 mt-1">
                You'll refine the exact location in the next step.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
          <div className="flex items-start">
            <FaMapMarkedAlt className="text-celadon mt-1 mr-2" />
            <div>
              <p className="font-helvetica-regular text-slategray">Location Selection</p>
              <p className="font-helvetica-light text-sm text-gray-600">
                You'll select the property location in the next step.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <FaHome className="text-celadon text-xl" />
        <span className="font-helvetica-light text-slategray">Step 1 of 4</span>
      </div>
    </motion.div>
  );
};
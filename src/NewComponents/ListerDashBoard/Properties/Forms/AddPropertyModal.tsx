import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BasicInfo } from './BasicInfo';
import { LocationInfo } from './LocationInfo';
import { DetailedInfo } from './DetailedInfo';
import FinalStep from './FinalStep';
import { propertyService } from '../../../../services/propertyService';
import { NewPropertyFormData, AddPropertyModalProps } from '../propertyTypes';

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onPropertyAdded }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NewPropertyFormData>({
    propertyName: '',
    propertyType: 'Residential', // Set default value
    specificType: '',
    action: '',
    location: '',
    coordinates: {
      lat: 0,
      lng: 0
    },
    streetAddress: '',
    googleMapsURL: '',
    unitNo: '',
    price: 0,
    currency: 'KES', // Set default currency
    space: 0,
    bedrooms: 0,
    bathrooms: 0,
    features: [],
    security: '',
    amenities: {
      furnished: false,
      pool: false,
      gym: false,
      garden: false,
      parking: false
    },
    images: [],
    additionalComments: '',
    cryptoAccepted: false,
    termsAccepted: false
  });

  const steps = [
    { component: BasicInfo, title: "Basic Information" },
    { component: LocationInfo, title: "Location Details" },
    { component: DetailedInfo, title: "Property Details" },
    { component: FinalStep, title: "Final Step" }
  ];

  const handleSubmit = async () => {
    try {
      await propertyService.createProperty(formData);
      onPropertyAdded();
      onClose();
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl"
          >
            <div className="mb-6">
              <h2 className="font-helvetica-regular text-2xl font-bold text-slategray">
                {steps[step - 1].title}
              </h2>
              <div className="flex gap-2 mt-4">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${index + 1 <= step ? 'bg-celadon' : 'bg-gray-200'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>
            </div>

            {React.createElement(steps[step - 1].component, { formData, setFormData })}

            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 font-helvetica-regular"
                >
                  Cancel
                </button>
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="px-4 py-2 text-slategray border border-celadon rounded-lg hover:bg-gray-50 font-helvetica-regular"
                  >
                    Back
                  </button>
                )}
              </div>
              <button
                onClick={step === 4 ? handleSubmit : () => {
                  // Validation for step 1
                  if (step === 1) {
                    if (!formData.propertyName || !formData.propertyType || !formData.specificType) {
                      alert('Please fill in all required fields marked with *');
                      return;
                    }
                  }
                  setStep(s => s + 1);
                }}
                className={`px-4 py-2 text-white rounded-lg font-helvetica-regular ${
                  step === 4 ? 'bg-celadon hover:bg-slategray' : 'bg-celadon hover:bg-slategray'
                }`}
              >
                {step === 4 ? 'Submit' : 'Next'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
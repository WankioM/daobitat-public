import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BasicInfo } from './BasicInfo';
import Loading from '../../../Errors/Loading';
import { LocationSearch } from './LocationSearch';
import { LocationConfirm } from './LocationConfirm';
import { DetailedInfo } from './DetailedInfo';
import FinalStep from './FinalStep';
import { propertyService } from '../../../../services/propertyService';
import { NewPropertyFormData, AddPropertyModalProps } from '../propertyTypes';


export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onPropertyAdded }) => {
  const [step, setStep] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState('Loading'); 
  const [loading, setLoading] = useState(false);
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
    { component: LocationSearch, title: "Search Location" },
    { component: LocationConfirm, title: "Confirm Location" },
    { component: DetailedInfo, title: "Property Details" },
    { component: FinalStep, title: "Final Step" }
  ];

  // In handleSubmit function in AddPropertyModal.tsx
  const handleSubmit = async () => {
    try {
      // Show loading indicator
      setLoading(true);
      setLoadingMessage('Uploading property information...');
      
      // If there are images in blob format, process them
      let processedImages = formData.images || [];
      
      if (processedImages.some(img => img.startsWith('blob:'))) {
        setLoadingMessage('Processing images...');
        // Use the batch processing service for any blob URLs
        processedImages = await propertyService.processBatchPropertyImages(processedImages);
      }
      
      // Create a submission-ready copy of the form data with processed images
      const submissionData = {
        ...formData,
        images: processedImages
      };
      
      setLoadingMessage('Saving property details...');
      await propertyService.createProperty(submissionData);
      
      // Hide loading indicator
      setLoading(false);
      
      onPropertyAdded();
      onClose();
    } catch (error) {
      // Hide loading indicator on error
      setLoading(false);
      console.error('Error creating property:', error);
      // Show an error message to the user
      alert('There was an error creating the property. Please try again.');
    }
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1: // Basic Info validation
        return formData.propertyName && formData.propertyType && formData.specificType
          ? true
          : "Please fill in all required fields marked with *";
      
      case 2: // Location Search validation
        return formData.location && formData.coordinates.lat !== 0 && formData.coordinates.lng !== 0
          ? true
          : "Please search and select a location";
      
      case 3: // Location Confirm validation
        // No additional validation needed as the coordinates are already set
        return true;
      
      case 4: // Detailed Info validation
        // You could add validation for price, action, etc.
        return true;
      
      case 5: // Final Step validation
        return formData.termsAccepted
          ? true
          : "Please accept the terms and conditions";
      
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    const validation = validateStep(step);
    
    if (validation === true) {
      setStep(s => s + 1);
    } else {
      alert(validation);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40 overflow-visible"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-visible"
            style={{ position: 'relative' }}
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

            <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {React.createElement(steps[step - 1].component, { formData, setFormData })}
            </div>

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
                onClick={step === 5 ? handleSubmit : goToNextStep}
                className={`px-4 py-2 text-white rounded-lg font-helvetica-regular ${
                  step === 5 ? 'bg-celadon hover:bg-slategray' : 'bg-celadon hover:bg-slategray'
                }`}
              >
                {step === 5 ? 'Submit' : 'Next'}
              </button>
            </div>
          </motion.div>
          <Loading isOpen={loading} message={loadingMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
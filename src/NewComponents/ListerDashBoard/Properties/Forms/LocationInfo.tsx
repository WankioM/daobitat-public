// LocationInfo.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { StepProps } from '../propertyTypes';

const fadeIn = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0 }
};

export const LocationInfo: React.FC<StepProps> = ({ formData, setFormData }) => {
 const encodedLocation = encodeURIComponent(formData.location);
 const googleMapsURL = `https://www.google.com/maps/embed/v1/place?q=${encodedLocation}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

 const handleBack = () => {
   setFormData({
     ...formData,
     location: '',
     streetAddress: '',
     googleMapsURL: ''
   });
 };

 return (
   <motion.div 
     className="space-y-4"
     variants={fadeIn}
     initial="hidden"
     animate="visible"
   >
     <div className="h-96 w-full rounded-lg overflow-hidden">
       <iframe
         width="100%"
         height="100%"
         style={{ border: 0 }}
         src={googleMapsURL}
         allowFullScreen
         aria-hidden="false"
         tabIndex={0}
       />
     </div>

     <div className="bg-gray-50 p-4 rounded-lg">
       <p className="font-helvetica-regular text-slategray">Selected Location: {formData.location}</p>
       <p className="font-helvetica-light text-sm text-gray-600 mt-1">{formData.streetAddress}</p>
     </div>

     <button
       onClick={handleBack}
       className="text-celadon hover:underline"
     >
       Choose Different Location
     </button>

     <div className="flex items-center space-x-4">
       <FaMapMarkerAlt className="text-celadon text-xl" />
       <span className="font-helvetica-light text-slategray">Step 2 of 4</span>
     </div>
   </motion.div>
 );
};
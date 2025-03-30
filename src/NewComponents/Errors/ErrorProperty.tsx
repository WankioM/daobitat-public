import React, { useState, useEffect } from 'react';
import errorUrls from '../../constants/errorurls';
import { motion, AnimatePresence } from 'framer-motion';

export type ErrorType = 'missingfields' | '404' | '500' | 'under-construction';

interface ErrorPropertyProps {
  message: string;
  type: ErrorType;
  actionLabel?: string;
  onAction?: () => void;
  mode?: 'inline' | 'toast';
  autoHideDuration?: number; // Time in ms to auto-hide toast messages
}

const ErrorProperty: React.FC<ErrorPropertyProps> = ({
  message,
  type,
  actionLabel,
  onAction,
  mode = 'inline',
  autoHideDuration = 5000, // Default 5 seconds for auto-hide
}) => {
  const [visible, setVisible] = useState(true);

  // Get the appropriate image URL based on type
  const getImageUrl = () => {
    if (type === 'missingfields') {
      // For missing fields, randomly select one of the available images
      const images = errorUrls.missingfields;
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    return errorUrls[type] || errorUrls.missingfields[0]; // Fallback to first missing fields image
  };

  // Auto-hide for toast mode
  useEffect(() => {
    if (mode === 'toast' && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [mode, autoHideDuration]);

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    // Auto-hide after action for both modes
    setVisible(false);
  };

  // Toast-style error notification
  if (mode === 'toast') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed z-50 top-4 left-1/2 transform -translate-x-1/2 max-w-md w-full mx-2 "
          >
            <div className="bg-milk rounded-lg shadow-md flex items-center p-4 border-l-4 border-rustyred min-h-[100px]">
            <div className="w-12 h-20 flex-shrink-0 mr-3">
                <img 
                  src={getImageUrl()} 
                  alt="Error" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 pr-2">
                <p className="font-helvetica-regular text-graphite text-sm">
                  {message}
                </p>
              </div>
              {actionLabel && (
                <button 
                  onClick={handleAction}
                  className="ml-2 px-3 py-1 bg-rustyred text-milk text-sm rounded font-helvetica-regular hover:bg-opacity-90"
                >
                  {actionLabel}
                </button>
              )}
              <button 
                onClick={() => setVisible(false)}
                className="ml-2 text-graphite opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Original inline error display
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-milk rounded-lg p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-rustyred"
        >
          <div className="flex-1 space-y-3">
            <h3 className="font-helvetica-regular text-xl text-graphite">
              Something went wrong
            </h3>
            <p className="font-helvetica-light text-graphite">
              {message}
            </p>
            {actionLabel && (
              <button
                onClick={handleAction}
                className="mt-4 px-4 py-2 bg-rustyred text-milk rounded hover:bg-opacity-90 transition-colors font-helvetica-regular"
              >
                {actionLabel}
              </button>
            )}
          </div>
          
          <div className="w-40 h-40 flex-shrink-0">
            <img 
              src={getImageUrl()} 
              alt="Error illustration" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorProperty;
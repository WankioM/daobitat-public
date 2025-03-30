import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { uploadImageToGCS } from '../../../services/imageUpload';
import Loading from '../../Errors/Loading';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  editable?: boolean;
  onImagesChange?: (images: string[]) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  className = '', 
  editable = false,
  onImagesChange 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !onImagesChange) return;
  
    setIsLoading(true);
    const newImages: string[] = [];
    const progress: { [key: string]: number } = {};
  
    try {
      // Process each file with real upload
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${Date.now()}-${i}`;
        
        // Set initial progress
        progress[fileId] = 0;
        setUploadProgress(prev => ({...prev, ...progress}));
        
        // Create a temporary URL for preview
        const previewUrl = URL.createObjectURL(file);
        newImages.push(previewUrl);
        
        try {
          // Update progress to show we're starting
          progress[fileId] = 10;
          setUploadProgress(prev => ({...prev, ...progress}));
          
          // Actual upload using the service
          const uploadedUrl = await uploadImageToGCS(file);
          
          // Update to completed
          progress[fileId] = 100;
          setUploadProgress(prev => ({...prev, ...progress}));
          
          // Replace the temporary URL with the cloud URL
          const index = newImages.indexOf(previewUrl);
          if (index !== -1) {
            newImages[index] = uploadedUrl;
          }
        } catch (error) {
          console.error(`Error uploading image ${i}:`, error);
          // Keep preview URL if upload fails
          progress[fileId] = 100; // Mark as complete
          setUploadProgress(prev => ({...prev, ...progress}));
        }
      }
  
      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    if (!onImagesChange) return;
    
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Adjust current index if necessary
    if (index <= currentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!images.length) {
    return (
      <div className={`relative ${className} bg-gray-100 flex items-center justify-center`}>
        {editable ? (
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              multiple
              accept="image/*"
              disabled={isLoading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2 bg-celadon text-white rounded-lg hover:bg-slategray transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaPlus /> Add Images
                </>
              )}
            </button>
          </div>
        ) : (
          <img
            src="/placeholder-property.jpg"
            alt="Property placeholder"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {editable && (
        <div className="absolute top-2 right-2 flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            multiple
            accept="image/*"
            disabled={isLoading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-full bg-celadon text-white hover:bg-slategray transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
            aria-label="Add images"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
          </button>
          <button
            onClick={() => handleDeleteImage(currentIndex)}
            className={`p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
            aria-label="Delete current image"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {isLoading && Object.keys(uploadProgress).length > 0 && (
        <Loading isOpen={isLoading} message="Uploading images..." />
      )}

      {images.length > 1 && !isLoading && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageGalleryProps {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, selectedIndex, onSelect }) => {
  const nextImage = () => {
    onSelect((selectedIndex + 1) % images.length);
  };

  const prevImage = () => {
    onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  return (
    <div className="relative w-full h-full">
      {/* Main Image */}
      <img
        src={images[selectedIndex]}
        alt={`Property image ${selectedIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-gray-800" size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            aria-label="Next image"
          >
            <FaChevronRight className="text-gray-800" size={20} />
          </button>
        </>
      )}

      {/* Image Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

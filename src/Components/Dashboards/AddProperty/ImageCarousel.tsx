import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  altText?: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative h-64 sm:h-80 md:h-96">
        {images.length > 0 && (
          <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
            <img
              src={images[currentIndex]}
              alt={altText[currentIndex] || `Image ${currentIndex + 1}`}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        onClick={handlePrevClick}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
      >
        &#10094;
      </button>
      <button
        onClick={handleNextClick}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
      >
        &#10095;
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

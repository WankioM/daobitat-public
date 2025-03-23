import React from 'react';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';

interface PropertyReviewsProps {
  propertyId: string;
}

// This is a placeholder component that will be populated with actual reviews in the future
const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  // For now, we'll just show a UI mockup with empty data
  return (
    <div className="bg-white/50 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-graphite">Property Reviews</h2>
        <div className="text-rustyred text-sm hover:underline cursor-pointer">
          Write a Review
        </div>
      </div>

      {/* Empty state */}
      <div className="py-8 flex flex-col items-center justify-center text-center">
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <FaRegStar key={i} className="text-2xl text-gray-300 mx-1" />
          ))}
        </div>
        <p className="text-gray-500 font-medium mb-2">No reviews yet</p>
        <p className="text-gray-400 max-w-md mx-auto">
          Be the first to share your experience with this property. Your feedback helps others make better decisions.
        </p>
        <button className="mt-4 bg-rustyred text-white px-6 py-2 rounded-full hover:bg-rustyred/90 transition-colors">
          Add Review
        </button>
      </div>

      {/* Sample review structure for future implementation */}
      <div className="hidden"> {/* Hidden until we have actual reviews */}
        <div className="border-t border-gray-100 py-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <FaUserCircle className="text-gray-400 text-3xl mr-3" />
              <div>
                <p className="font-medium text-graphite">John Doe</p>
                <p className="text-xs text-gray-500">Visited: January 2023</p>
              </div>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                i < 4 ? 
                <FaStar key={i} className="text-yellow-400 text-lg" /> : 
                <FaRegStar key={i} className="text-yellow-400 text-lg" />
              ))}
            </div>
          </div>
          <p className="mt-3 text-gray-600">
            Sample review text would go here. This is a placeholder for future review content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyReviews;
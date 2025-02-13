import React from 'react';

const FeaturedProperties = () => {
  return (
    <div className="w-full bg-milk py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-helvetica text-graphite mb-8">Featured Properties</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
          {[1, 2, 3].map((_, index) => (
            <div 
              key={index}
              className="min-w-[300px] h-64 rounded-lg overflow-hidden relative flex-shrink-0 
                       bg-lightstone shadow-md transition-transform hover:scale-105 snap-start"
            >
              <img 
                src={`/api/placeholder/300/200`} 
                alt={`Featured property ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-semibold">Luxury Villa {index + 1}</h3>
                <p className="text-sm opacity-90">Starting from $299/night</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
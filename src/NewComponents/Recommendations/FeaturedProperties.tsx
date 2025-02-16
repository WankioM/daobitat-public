import React from 'react';

const FeaturedProperties = () => {
  return (
    <div className="w-full bg-milk py-12 px-12 flex justify-center">
  <div className="max-w-7xl w-full px-4">
    <h2 className="text-3xl font-helvetica text-graphite mb-8 text-center">
      Featured Properties
    </h2>
    <div className="flex gap-6 overflow-x-auto pb-4 snap-x justify-center">
    {[
  {
    img: "https://i.pinimg.com/736x/6c/8c/40/6c8c407f2137453a2862b4fc13ba6db9.jpg",
    title: "Modern Beachfront Villa",
    price: "499"
  },
  {
    img: "https://i.pinimg.com/736x/c2/e3/e6/c2e3e6e0cb1ac12673adc1ae179785aa.jpg",
    title: "Luxury Mountain Retreat",
    price: "399"
  },
  {
    img: "https://i.pinimg.com/736x/ec/37/0b/ec370bfb3649a826a95019534608690a.jpg",
    title: "Contemporary City Penthouse",
    price: "599"
  },
  {
    img: "https://town-n-country-living.com/wp-content/uploads/2023/10/rustic-porch.jpg",
    title: "Charming Country Estate",
    price: "450"
  }
      ].map((property, index) => (
        <div 
          key={index}
          className="min-w-[300px] h-64 rounded-lg overflow-hidden relative flex-shrink-0 
                     bg-lightstone shadow-md transition-transform hover:scale-105 snap-start"
        >
          <img 
            src={property.img}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-sm opacity-90">Starting from ${property.price}/night</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default FeaturedProperties;
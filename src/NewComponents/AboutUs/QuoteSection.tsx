import React from "react";

const QuoteSection = () => {
  return (
    <div className="bg-cream py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-beige/50 p-8 md:p-12 lg:p-16 rounded-lg relative">
          <div className="absolute -top-6 left-12 w-12 h-12 bg-red rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cream">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>

          <blockquote className="text-xl md:text-2xl text-dark font-medium italic mb-8">
          For once, I don’t need to ‘know a guy who knows a guy’ to invest in real estate.
          </blockquote>

          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img
                src="https://media.licdn.com/dms/image/v2/D4D03AQEND-AJ00dZjw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1711210431236?e=1747872000&v=beta&t=Rz4svPZwgCQE4o8UAP-9Y5j3rDxdd8JglJ4MRvJVrm0"
                alt="CEO"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-dark">Andre Owano</p>
              <p className="text-dark/70 text-sm">Lives in Nairobi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSection;

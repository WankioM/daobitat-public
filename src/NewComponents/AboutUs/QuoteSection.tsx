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
            A living force exists within everything we create. Even small acts of creativity or kindness have the power to ripple out and contribute to a sustained imagination that makes things possible again and again.
          </blockquote>

          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=389&q=80"
                alt="CEO"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-dark">Jane Smith</p>
              <p className="text-dark/70 text-sm">Founder & CEO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSection;

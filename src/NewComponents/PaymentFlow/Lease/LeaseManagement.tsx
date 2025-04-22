import React from 'react';

const LeaseManagement: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="w-20 h-20 bg-rustyred/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rustyred" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-graphite mb-4">Lease Management Coming Soon</h2>
          
          <p className="text-gray-600 text-lg mb-8">
            We're working on building a comprehensive lease management system that will allow you to:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-8">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Create and manage digital lease agreements</span>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Track rent payments and payment history</span>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Process security deposits and refunds</span>
            </div>
            <div className="flex items-start">
              <svg className="h-6 w-6 text-rustyred mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Handle lease renewals and terminations</span>
            </div>
          </div>
          
          <div className="bg-lightstone/30 p-6 rounded-lg inline-block">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-rustyred mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Expected launch: Q2 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseManagement;
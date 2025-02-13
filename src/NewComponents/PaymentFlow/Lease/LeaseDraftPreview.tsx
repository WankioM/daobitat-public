import React from 'react';

interface LeasePreviewProps {
  onProceedToSign: () => void;
  onBack: () => void;
  leaseData: {
    propertyDetails: {
      address: string;
      propertyType: string;
      rentAmount: number;
    };
    tenantInfo: {
      name: string;
      email: string;
    };
    landlordInfo: {
      name: string;
      email: string;
    };
    leaseTerms: {
      startDate: string;
      endDate: string;
      monthlyRent: number;
      securityDeposit: number;
    };
  };
}

const LeaseDraftPreview: React.FC<LeasePreviewProps> = ({
  onProceedToSign,
  onBack,
  leaseData
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Lease Agreement Preview</h1>
      
      {/* Property Details Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-2"><span className="font-medium">Address:</span> {leaseData.propertyDetails.address}</p>
          <p className="mb-2"><span className="font-medium">Property Type:</span> {leaseData.propertyDetails.propertyType}</p>
          <p><span className="font-medium">Rent Amount:</span> ${leaseData.propertyDetails.rentAmount}/month</p>
        </div>
      </section>

      {/* Tenant & Landlord Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Parties Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-3">Tenant</h3>
            <p className="mb-2"><span className="font-medium">Name:</span> {leaseData.tenantInfo.name}</p>
            <p><span className="font-medium">Email:</span> {leaseData.tenantInfo.email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-3">Landlord</h3>
            <p className="mb-2"><span className="font-medium">Name:</span> {leaseData.landlordInfo.name}</p>
            <p><span className="font-medium">Email:</span> {leaseData.landlordInfo.email}</p>
          </div>
        </div>
      </section>

      {/* Lease Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lease Terms</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-2"><span className="font-medium">Start Date:</span> {leaseData.leaseTerms.startDate}</p>
          <p className="mb-2"><span className="font-medium">End Date:</span> {leaseData.leaseTerms.endDate}</p>
          <p className="mb-2"><span className="font-medium">Monthly Rent:</span> ${leaseData.leaseTerms.monthlyRent}</p>
          <p><span className="font-medium">Security Deposit:</span> ${leaseData.leaseTerms.securityDeposit}</p>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onProceedToSign}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed to Sign
        </button>
      </div>
    </div>
  );
};

export default LeaseDraftPreview;

import React, { useState } from 'react';

interface LeaseTerminationProps {
  leaseDetails: {
    id: string;
    propertyAddress: string;
    startDate: string;
    endDate: string;
    currentTenant: string;
    landlord: string;
  };
  onSubmit: (data: {
    leaseId: string;
    requestedEndDate: string;
    reason: string;
    additionalNotes: string;
  }) => void;
  onCancel: () => void;
}

const LeaseTermination: React.FC<LeaseTerminationProps> = ({
  leaseDetails,
  onSubmit,
  onCancel,
}) => {
  const [requestedEndDate, setRequestedEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      leaseId: leaseDetails.id,
      requestedEndDate,
      reason,
      additionalNotes,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Lease Termination Request</h1>

      {/* Lease Details Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Lease Details</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Property:</span> {leaseDetails.propertyAddress}</p>
          <p><span className="font-medium">Lease Period:</span> {leaseDetails.startDate} - {leaseDetails.endDate}</p>
          <p><span className="font-medium">Tenant:</span> {leaseDetails.currentTenant}</p>
          <p><span className="font-medium">Landlord:</span> {leaseDetails.landlord}</p>
        </div>
      </div>

      {/* Termination Request Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requested End Date
          </label>
          <input
            type="date"
            value={requestedEndDate}
            onChange={(e) => setRequestedEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Termination
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a reason</option>
            <option value="relocation">Relocation</option>
            <option value="financial">Financial Reasons</option>
            <option value="maintenance">Maintenance Issues</option>
            <option value="personal">Personal Circumstances</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="Please provide any additional details or specific circumstances..."
          />
        </div>

        {/* Notice and Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please note that submitting this request does not guarantee approval.
                The landlord will review your request and respond within 5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaseTermination;

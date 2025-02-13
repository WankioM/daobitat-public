import React from 'react';

interface LeaseViewProps {
  leases: Array<{
    id: string;
    propertyAddress: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    nextPaymentDate: string;
    status: 'active' | 'pending' | 'expired';
  }>;
  paymentHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    type: 'rent' | 'deposit' | 'fee';
  }>;
  onRequestAmendment: (leaseId: string) => void;
}

const LeaseView: React.FC<LeaseViewProps> = ({
  leases,
  paymentHistory,
  onRequestAmendment,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Active Leases Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Active Leases</h2>
        <div className="grid gap-6">
          {leases.map((lease) => (
            <div
              key={lease.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{lease.propertyAddress}</h3>
                  <p className="text-gray-600">
                    {lease.startDate} - {lease.endDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    lease.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : lease.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Monthly Rent</p>
                  <p className="font-semibold">${lease.monthlyRent}</p>
                </div>
                <div>
                  <p className="text-gray-600">Next Payment Due</p>
                  <p className="font-semibold">{lease.nextPaymentDate}</p>
                </div>
              </div>
              <button
                onClick={() => onRequestAmendment(lease.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Amendment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaseView;

import React, { useState } from 'react';
import LeaseDraftPreview from './LeaseDraftPreview';
import DigitalSignature from './DigitalSignature';
import PaymentConfirmation from './PaymentConfirmation';
import LeaseView from './LeaseView';
import LeaseTermination from './LeaseTermination';

type LeasePageType = 'view' | 'draft' | 'sign' | 'payment' | 'termination';

// Demo data
const demoLeases = [
  {
    id: 'lease-001',
    propertyAddress: '123 Blockchain Avenue, Crypto City',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    monthlyRent: 2500,
    nextPaymentDate: '2025-03-01',
    status: 'active' as const,
  },
];

const demoPaymentHistory = [
  {
    id: 'payment-001',
    date: '2025-02-01',
    amount: 2500,
    status: 'completed' as const,
    type: 'rent' as const,
  },
  {
    id: 'payment-002',
    date: '2025-01-01',
    amount: 2500,
    status: 'completed' as const,
    type: 'rent' as const,
  },
  {
    id: 'payment-003',
    date: '2024-12-01',
    amount: 5000,
    status: 'completed' as const,
    type: 'deposit' as const,
  },
];

const demoLeaseData = {
  propertyDetails: {
    address: '123 Blockchain Avenue, Crypto City',
    propertyType: 'Apartment',
    rentAmount: 2500,
  },
  tenantInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  landlordInfo: {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  leaseTerms: {
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    monthlyRent: 2500,
    securityDeposit: 5000,
  },
};

const LeaseManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<LeasePageType>('view');
  const [signature, setSignature] = useState<string>('');

  const handleSignatureComplete = (signatureData: string) => {
    setSignature(signatureData);
    setCurrentPage('payment');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'view':
        return (
          <div className="space-y-4">
            <div className="flex justify-end space-x-4 mb-6">
              <button
                onClick={() => setCurrentPage('draft')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Lease
              </button>
              <button
                onClick={() => setCurrentPage('termination')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Request Termination
              </button>
            </div>
            <LeaseView
              leases={demoLeases}
              paymentHistory={demoPaymentHistory}
              onRequestAmendment={(leaseId) => {
                console.log('Amendment requested for lease:', leaseId);
              }}
            />
          </div>
        );
      case 'draft':
        return (
          <LeaseDraftPreview
            leaseData={demoLeaseData}
            onProceedToSign={() => setCurrentPage('sign')}
            onBack={() => setCurrentPage('view')}
          />
        );
      case 'sign':
        return (
          <DigitalSignature
            onSign={handleSignatureComplete}
            onBack={() => setCurrentPage('draft')}
          />
        );
      case 'payment':
        return (
          <PaymentConfirmation
            paymentDetails={{
              amount: 7500, // First month + security deposit
              method: 'Crypto Wallet',
              date: new Date().toISOString().split('T')[0],
              transactionId: 'tx-' + Math.random().toString(36).substr(2, 9),
              propertyAddress: demoLeaseData.propertyDetails.address,
              leaseStartDate: demoLeaseData.leaseTerms.startDate,
              leaseEndDate: demoLeaseData.leaseTerms.endDate,
            }}
            onViewLease={() => setCurrentPage('view')}
            onDownloadReceipt={() => {
              console.log('Downloading receipt...');
            }}
          />
        );
      case 'termination':
        return (
          <LeaseTermination
            leaseDetails={{
              id: demoLeases[0].id,
              propertyAddress: demoLeases[0].propertyAddress,
              startDate: demoLeases[0].startDate,
              endDate: demoLeases[0].endDate,
              currentTenant: demoLeaseData.tenantInfo.name,
              landlord: demoLeaseData.landlordInfo.name,
            }}
            onSubmit={(data) => {
              console.log('Termination request submitted:', data);
              setCurrentPage('view');
            }}
            onCancel={() => setCurrentPage('view')}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderPage()}
    </div>
  );
};

export default LeaseManagement;

import React, { useState, useEffect } from 'react';
import { CSSProperties } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useUser } from '../../contexts/UserContext';
import { Timestamp } from 'firebase/firestore';
import CreateLienComponent from './CreateLien';

const customStyles: CSSProperties = {
  ['--select-button-svg' as string]: "url('data:image/svg+xml...",
  fontFamily: '"Public Sans", "Noto Sans", sans-serif'
};

interface LoanRequest {
  id: string;
  borrowerId: string;
  propertyId: string;
  loanAmount: string;
  interestRate: string;
  repaymentPeriod: string;
  timestamp: Timestamp;
}

const ApprovedRequests: React.FC = () => {
  const [approvedRequests, setApprovedRequests] = useState<LoanRequest[]>([]);
  const { user } = useUser();
  const [isCreateLienOpen, setIsCreateLienOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCreateLien = (request: LoanRequest) => {
    if (!isValidEthValue(request.loanAmount)) {
      setError(`Invalid loan amount for Property ID: ${request.propertyId}`);
      return;
    }
    setSelectedRequest(request);
    setIsCreateLienOpen(true);
    setError(null);
  };

  const closeCreateLien = () => {
    setIsCreateLienOpen(false);
  };

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      if (!user) return;

      try {
        const userUid = user.uid;
        const loanRequestsRef = collection(firestore, 'financing', 'Requested loans', userUid);
        const q = query(loanRequestsRef, where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);

        const requests: LoanRequest[] = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() } as LoanRequest);
        });

        setApprovedRequests(requests);
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      }
    };

    fetchApprovedRequests();
  }, [user]);

  // Helper function to check if a value is a valid ETH amount
  const isValidEthValue = (value: string): boolean => {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && parsed > 0;
  };

  // Helper function to format ETH value for display
  const formatEthValue = (value: string): string => {
    if (!isValidEthValue(value)) {
      return "Invalid Amount";
    }
    return parseFloat(value).toFixed(4);
  };

  return (
    <div className="layout-container flex h-full grow flex-col">
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-full max-w-[800px] py-5 flex-1">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Approved Loan Requests</h2>
        
        {error && <p className="text-red-500 px-4">{error}</p>}

        {approvedRequests.length === 0 ? (
          <p className="text-white px-4">No Approved requests found.</p>
        ) : (
          <ul className="space-y-4">
            {approvedRequests.map((request) => (
              <li key={request.id} className="bg-[#261c21] rounded-xl p-4 text-white">
                <div>
                  <p>Property ID: {request.propertyId}</p>
                  <p>Loan Amount: {formatEthValue(request.loanAmount)} ETH</p>
                  <p>Interest Rate: {request.interestRate}%</p>
                  <p>Repayment Period: {request.repaymentPeriod}</p>
                  <p>Requested on: {request.timestamp.toDate().toLocaleString()}</p>
                </div>
                <button>View Collateral</button>
                <button 
                  onClick={() => openCreateLien(request)}
                  className="mt-2 bg-[#533c47] text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#3b2934] focus:outline-none focus:ring-2 focus:ring-[#b89dab]"
                  disabled={!isValidEthValue(request.loanAmount)}
                >
                  Go live on MarketPlace 
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {isCreateLienOpen && selectedRequest && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-[#533c47] p-1 rounded-lg">
          <CreateLienComponent 
            onClose={closeCreateLien}
            propertyId={selectedRequest.propertyId}
            loanAmount={selectedRequest.loanAmount}
            landPrice={selectedRequest.loanAmount} // Assuming land price is the same as loan amount
          />
        </div>
      </div>
    )}
  </div>
);
};

export default ApprovedRequests;
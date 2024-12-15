import React, { useState, useEffect } from 'react';
import { CSSProperties } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useUser } from '../../contexts/UserContext';
import { Timestamp } from 'firebase/firestore';

const customStyles: CSSProperties = {
  ['--select-button-svg' as string]: "url('data:image/svg+xml...",
  fontFamily: '"Public Sans", "Noto Sans", sans-serif'
};

interface LoanRequest {
  id: string;
  propertyId: string;
  loanAmount: string;
  interestRate: string;
  repaymentPeriod: string;
  timestamp: Timestamp;
}

const PendingRequests: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<LoanRequest[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!user) return;

      try {
        const userUid = user.uid;
        const loanRequestsRef = collection(firestore, 'financing', 'Requested loans', userUid);
        const q = query(loanRequestsRef, where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);

        const requests: LoanRequest[] = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() } as LoanRequest);
        });

        setPendingRequests(requests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, [user]);

  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full max-w-[800px] py-5 flex-1">
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Pending Loan Requests</h2>
          
          {pendingRequests.length === 0 ? (
            <p className="text-white px-4">No pending requests found.</p>
          ) : (
            <ul className="space-y-4">
              {pendingRequests.map((request) => (
                <li key={request.id} className="bg-[#261c21] rounded-xl p-4 text-white">
                  <p>Property ID: {request.propertyId}</p>
                  <p>Loan Amount: {request.loanAmount}</p>
                  <p>Interest Rate: {request.interestRate}</p>
                  <p>Repayment Period: {request.repaymentPeriod}</p>
                  <p>Requested on: {request.timestamp.toDate().toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;
import React from 'react';

interface ProgressBarProps {
  totalPaid: number;
  totalRemaining: number;
  nextInstallmentDate: string;
  nextInstallmentAmount: number;
  totalFinanced: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  totalPaid,
  totalRemaining,
  nextInstallmentDate,
  nextInstallmentAmount,
  totalFinanced
}) => {
  const progressPercentage = (totalPaid / totalFinanced) * 100;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="mb-2">
        <div className="bg-gray-700 h-4 rounded-full">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-white">
        <p>Total Paid: ${totalPaid.toFixed(2)}</p>
        <p>Total Remaining: ${totalRemaining.toFixed(2)}</p>
        <p>Next Installment: ${nextInstallmentAmount.toFixed(2)} on {nextInstallmentDate}</p>
        <p>Total Financed: ${totalFinanced.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
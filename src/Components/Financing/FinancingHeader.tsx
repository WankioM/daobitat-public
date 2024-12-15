import React, {useState} from 'react';
import { CSSProperties } from 'react';
import ConnectYourWallet from '../Dashboards/AddProperty/Billing/ConnectYourWallet';

interface FinancingHeaderProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
  }

const customStyles: CSSProperties = {
  ['--select-button-svg' as string]: "url('data:image/svg+xml...",
  fontFamily: '"Public Sans", "Noto Sans", sans-serif'
};

const FinancingHeader: React.FC<FinancingHeaderProps> = ({ currentTab, onTabChange }) => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleConnectWalletClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
  <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#382932] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              
            </div>
          
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
  
            <a className={`text-white text-sm font-medium leading-normal ${currentTab === 'Borrow' ? 'underline' : ''}`} href="#" onClick={() => onTabChange('Borrow')}>Borrow</a>
          <a className={`text-white text-sm font-medium leading-normal ${currentTab === 'Lend' ? 'underline' : ''}`} href="#" onClick={() => onTabChange('Lend')}>Marketplace</a>
          <a className={`text-white text-sm font-medium leading-normal ${currentTab === 'ApprovedRequests' ? 'underline' : ''}`} href="#" onClick={() => onTabChange('ApprovedRequests')}>Approved requests</a>
          <a className={`text-white text-sm font-medium leading-normal ${currentTab === 'PendingRequests' ? 'underline' : ''}`} href="#" onClick={() => onTabChange('PendingRequests')}>Pending requests</a>
          <a className={`text-white text-sm font-medium leading-normal ${currentTab === 'Statement' ? 'underline' : ''}`} href="#" onClick={() => onTabChange('Statement')}>Statement</a>
            </div>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#5f133e] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={handleConnectWalletClick}
            >
              <span className="truncate">Connect Wallet</span>
            </button>
           
          </div>
        </header>
        {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className=" rounded-lg max-w-3xl h-auto max-h-[90vh] w-full">
                <div className="flex justify-end">
                <button
                onClick={closePopup}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#181114] text-gray-400 hover:bg-[#b7e3cc] hover:text-gray-700 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
                </div>
                <ConnectYourWallet />
              </div>
            </div>
          )}
          </>
        )}


export default FinancingHeader ;
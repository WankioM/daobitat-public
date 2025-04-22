import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../NewContexts/UserContext';
import NavBar from '../NavBar/Navbar';
import AccountInfo from './AccountInfo/AccountInfo';
import Properties from './Properties/Properties';
import Billings from '../ListerDashBoard/Billings/Billings';
import Messages from '../Messages/Messages';
import WishList from './WishList/WishList';
import LeaseManagement from '../PaymentFlow/Lease/LeaseManagement';
import PlotInDev from '../PaymentFlow/InDev/PlotInDev';

export type TabType = 'AccountInfo' | 'Properties' | 'Messages' | 'Wishlist' | 'Billings' | 'ActiveLeases' | 'PaymentFlow';

const ListerDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Properties');
  const { user } = useUser();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialPaymentSection, setInitialPaymentSection] = useState<'Payments' | 'Ownership' | 'Security'>('Payments');

  useEffect(() => {
    // Wait a moment for user data to load before deciding to redirect
    const authCheckTimer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 1000);

    return () => clearTimeout(authCheckTimer);
  }, []);

  useEffect(() => {
    const state = location.state as { 
      activeTab?: TabType; 
      paymentSection?: 'Payments' | 'Ownership' | 'Security';
    } | null;
    
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      
      // If we have a payment section and the active tab is PaymentFlow,
      // set it in local state to pass to PlotInDev
      if (state.activeTab === 'PaymentFlow' && state.paymentSection) {
        setInitialPaymentSection(state.paymentSection);
      }
    }
  }, [location]);

   useEffect(() => {
    if (!isCheckingAuth && !user) {
      navigate('/login');
    }
  }, [user, isCheckingAuth, navigate]);

  if (isCheckingAuth) return <div>Checking authentication...</div>;
  
  if (!user) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'AccountInfo':
        return <AccountInfo />;
      case 'Properties':
        return <Properties />;
      case 'Messages':
        return <Messages />;
      case 'Wishlist':
        return <WishList />;
      case 'Billings':
        return <Billings />;
      
      case 'ActiveLeases':
        return <LeaseManagement />;
        case 'PaymentFlow':
      return <PlotInDev initialSection={initialPaymentSection} />;
      default:
        return <Properties />;
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-milk">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-graphite">
        <NavBar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ListerDashboard;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../NewContexts/UserContext';
import NavBar from '../NavBar/Navbar';
import AccountInfo from './AccountInfo/AccountInfo';
import Properties from './Properties/Properties';
import Billings from '../ListerDashBoard/Billings/Billings';
import Messages from '../Messages/Messages';
import Financing from '../ListerDashBoard/FinancingDashboard/Financing';
import WishList from './WishList/WishList';
import LeaseManagement from '../PaymentFlow/Lease/LeaseManagement';

export type TabType = 'AccountInfo' | 'Properties' | 'Messages' | 'Wishlist' | 'Billings' | 'Financing' | 'ActiveLeases';

const ListerDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Properties');
  const { user } = useUser();

  useEffect(() => {
    const state = location.state as { activeTab?: TabType } | null;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
      case 'Financing':
        return <Financing />;
      case 'ActiveLeases':
        return <LeaseManagement />;
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
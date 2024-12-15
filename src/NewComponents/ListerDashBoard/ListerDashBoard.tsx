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

export type TabType = 'AccountInfo' | 'Properties' | 'Messages' | 'Wishlist' | 'Billings' | 'Financing';

const ListerDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Properties');
  const { user } = useUser();

  useEffect(() => {
    // Check for active tab in location state
    const state = location.state as { activeTab?: TabType } | null;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [location]);

  useEffect(() => {
    if (user?.role !== 'lister') {
      navigate('/');
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
      default:
        return <Properties />;
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <NavBar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListerDashboard;
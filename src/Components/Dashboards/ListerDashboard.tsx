// hia/src/Components/Dashboards/ListerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import AccountInfo from './AccountInfo';
import Properties from './AddProperty/Properties';
import Billings from './AddProperty/Billing/Billings';
import Messages from './Messages';
import { useNavigate } from 'react-router-dom';
import FinancingDashboard from '../Financing/Financing';
import './ListerDashboard.css';

const ListerDashboard: React.FC = () => {
  const { user, signOutUser } = useUser();
  const [activeTab, setActiveTab] = useState<string>('Properties');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'lister') {
      // Redirect if the user is not a property lister
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignOut = () => {
    signOutUser();
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'AccountInfo':
        return <AccountInfo />;
      case 'Properties':
        return <Properties />;
      case 'Messages':
        return <Messages />;
      case 'Billings':
        return <Billings />;
      case 'Financing':
        return <FinancingDashboard />;
      default:
        return <Properties />;
    }
  };

  if (!user) {
    // Optionally handle the case where user data is not loaded
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
    <nav className="dashboard-nav">
      <div className="dashboard-user">
        <span>Hi, {user.name || 'User'}</span>
      </div>
      <ul className="dashboard-menu">
        <li onClick={goHome}>Home</li>
        <li className={activeTab === 'AccountInfo' ? 'active' : ''} onClick={() => setActiveTab('AccountInfo')}>Profile</li>
        <li className={activeTab === 'Properties' ? 'active' : ''} onClick={() => setActiveTab('Properties')}>Properties</li>
        <li className={activeTab === 'Messages' ? 'active' : ''} onClick={() => setActiveTab('Messages')}>Messages</li>
        <li className={activeTab === 'Billings' ? 'active' : ''} onClick={() => setActiveTab('Billings')}>Billing</li>
        <li className={activeTab === 'Financing' ? 'active' : ''} onClick={() => setActiveTab('Financing')}>Financing</li>
        <li onClick={handleSignOut}>Sign Out</li>
      </ul>
    </nav>
    <div className="dashboard-content">
      {renderContent()}
    </div>
  </div>
  );
};

export default ListerDashboard;

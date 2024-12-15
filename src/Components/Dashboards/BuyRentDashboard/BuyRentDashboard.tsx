import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import UserAccount from './AccountInfo';
import WishList from './WishList';
import { useNavigate } from 'react-router-dom';
import Billings from '../AddProperty/Billing/Billings';
import './BuyRentDashboard.css';
import ThreadList from './Messages';

const BuyRentDashboard: React.FC = () => {
  const { user, signOutUser } = useUser();
  const [activeTab, setActiveTab] = useState<string>('WishList');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'renter' && user?.role !== 'buyer') {
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
        return <UserAccount />;
      case 'WishList':
        return <WishList />;
      case 'Messages':
        return <ThreadList
            />;
      case 'Billings':
        return <Billings />
      default:
        return <WishList />;
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
        <div onClick={goHome}>
          Home
        </div>
        <ul className="dashboard-menu">
          <li className={activeTab === 'AccountInfo' ? 'active' : ''} onClick={() => setActiveTab('AccountInfo')}>Profile</li>
          <li className={activeTab === 'WishList' ? 'active' : ''} onClick={() => setActiveTab('WishList')}>Saved</li>
          <li className={activeTab === 'Messages' ? 'active' : ''} onClick={() => setActiveTab('Messages')}>Messages</li>
          <li className={activeTab === 'Billings' ? 'active' : ''} onClick={() => setActiveTab('Billings')}>Billing</li>
          <li onClick={handleSignOut}>Sign Out</li>
        </ul>
      </nav>
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default BuyRentDashboard;

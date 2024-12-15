import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../NewContexts/UserContext';
import { 
  FaHome, 
  FaUser, 
  FaBuilding, 
  FaEnvelope, 
  FaCreditCard, 
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHeart
} from 'react-icons/fa';

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  const { user, signOutUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'Home', icon: <FaHome size={20} />, onClick: () => navigate('/') },
    { id: 'AccountInfo', label: 'Profile', icon: <FaUser size={20} /> },
    { id: 'Properties', label: 'Properties', icon: <FaBuilding size={20} /> },
    { id: 'Messages', label: 'Messages', icon: <FaEnvelope size={20} /> },
    { id: 'Wishlist', label: 'Wishlist', icon: <FaHeart size={20} /> },
    { id: 'Billings', label: 'Billing', icon: <FaCreditCard size={20} /> },
    { id: 'Financing', label: 'Financing', icon: <FaChartLine size={20} /> },
  ];

  const handleSignOut = () => {
    signOutUser();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#24191E] text-white"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col h-full bg-[#24191E] text-white">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser size={24} className="text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="font-helvetica-regular text-lg">{user?.name || 'User'}</h2>
                <p className="text-sm text-gray-400 font-helvetica-light">Property Lister</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      item.onClick ? item.onClick() : setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-xl flex items-center space-x-3
                      font-helvetica-light transition-colors duration-200
                      ${activeTab === item.id ? 
                        'bg-white/10 text-white' : 
                        'text-gray-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 rounded-xl flex items-center space-x-3 
                       text-gray-400 hover:bg-white/5 hover:text-white
                       transition-colors duration-200 font-helvetica-light"
            >
              <FaSignOutAlt size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default NavBar;
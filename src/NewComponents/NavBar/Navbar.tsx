import React, { useState, useEffect } from 'react';
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
  FaHeart,
  FaFileContract
} from 'react-icons/fa';

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  const { user, signOutUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Inject gradient animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @property --hue1 {
        syntax: "<number>";
        inherits: false;
        initial-value: 0;
      }
      
      @property --hue2 {
        syntax: "<number>";
        inherits: false;
        initial-value: 0;
      }
      
      .gradient-sidebar {
        position: relative;
        overflow: hidden;
      }
      
      .gradient-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          linear-gradient(
            135deg,
            rgba(177, 116, 87, var(--hue1)),
            rgba(74, 73, 71, 0.9)
          ),
          linear-gradient(
            225deg,
            rgba(219, 210, 194, var(--hue2)),
            rgba(74, 73, 71, 0.8)
          );
        z-index: 0;
        animation: gradientAnimation 8s ease infinite;
      }
      
      @keyframes gradientAnimation {
        0% {
          --hue1: 0.05;
          --hue2: 0.05;
        }
        50% {
          --hue1: 0.2;
          --hue2: 0.15;
        }
        100% {
          --hue1: 0.05;
          --hue2: 0.05;
        }
      }
      
      /* Bottom border animation for nav items */
      .nav-item-link {
        position: relative;
      }
      
      .nav-item-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: #F9F7F0;
        transition: width 0.3s ease, left 0.3s ease;
      }
      
      .nav-item-link:hover::after {
        width: 100%;
        left: 0;
      }
      
      .nav-item-active::after {
        width: 100%;
        left: 0;
      }
      
      /* For browsers that don't support @property */
      @supports not (animation-timeline: scroll()) {
        .gradient-bg {
          background: 
            linear-gradient(
              135deg,
              rgba(177, 116, 87, 0.15),
              rgba(74, 73, 71, 0.9)
            ),
            linear-gradient(
              225deg,
              rgba(219, 210, 194, 0.15),
              rgba(74, 73, 71, 0.8)
            );
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home', icon: <FaHome size={20} />, onClick: () => navigate('/') },
    { id: 'AccountInfo', label: 'Profile', icon: <FaUser size={20} /> },
    { id: 'Properties', label: 'Properties', icon: <FaBuilding size={20} /> },
    { id: 'Messages', label: 'Messages', icon: <FaEnvelope size={20} /> },
    { id: 'Wishlist', label: 'Wishlist', icon: <FaHeart size={20} /> },
    { id: 'Billings', label: 'Billing', icon: <FaCreditCard size={20} /> },
    { id: 'Financing', label: 'Financing', icon: <FaChartLine size={20} /> },
    { id: 'ActiveLeases', label: 'Active Leases', icon: <FaFileContract size={20} /> },
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

      {/* Sidebar with gradient */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        gradient-sidebar
      `}>
        {/* Gradient background */}
        <div className="gradient-bg"></div>
        
        {/* Content above gradient */}
        <div className="flex flex-col h-full relative z-10">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-700/50">
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
                <h2 className="font-helvetica-regular text-lg text-milk">{user?.name || 'User'}</h2>
                <p className="text-sm text-milk/70 font-helvetica-light">Property Lister</p>
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
                      nav-item-link w-full px-4 py-3 rounded-xl flex items-center space-x-3
                      font-helvetica-light transition-colors duration-200
                      ${activeTab === item.id ? 
                        'text-milk nav-item-active' : 
                        'text-milk/70 hover:text-milk'}
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
          <div className="p-4 border-t border-gray-700/50">
            <button
              onClick={handleSignOut}
              className="nav-item-link w-full px-4 py-3 rounded-xl flex items-center space-x-3 
                       text-milk/70 hover:text-milk
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
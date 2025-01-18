import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOptionalUser } from '../../hooks/useOptionalUser';

const navItems = ['Buy', 'Rent', 'Sell', 'Advertise', 'Financing', 'About'];

interface User {
  name: string;
  // add other user properties as needed
}

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useOptionalUser();

  const handleUsernameClick = () => {
    if (user) {
      navigate('/listerdashboard');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4
                    bg-[#231A1F]/70 border-b-2 border-white/10">
      <Link to="/" className="text-2xl font-brown-sugar text-[#B7e3cc] cursor-pointer
                    transition-transform duration-300 hover:scale-105
                    drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
        DAOBITAT
      </Link>

      <div className="hidden md:flex gap-8">
        {navItems.map(item => (
          <div
            key={item}
            className="text-white font-helvetica hover:text-[#B7e3cc] cursor-pointer
                     relative after:content-[''] after:absolute after:w-0 after:h-0.5
                     after:bg-[#B7e3cc] after:left-1/2 after:-bottom-1.5
                     after:transition-all after:duration-300
                     hover:after:w-full hover:after:left-0"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        {!user ? (
          <Link
            to="/login"
            className="px-4 py-2 border border-[#B7e3cc] rounded-full text-white
                     transition-all duration-300 hover:bg-[#B7e3cc] hover:text-black"
          >
            Sign In
          </Link>
        ) : (
          <div
            onClick={handleUsernameClick}
            className="px-4 py-2 border border-[#B7e3cc] rounded-full text-white
                     transition-all duration-300 hover:bg-[#B7e3cc] hover:text-black
                     cursor-pointer"
          >
            Hi, {user.name}
          </div>
        )}
      </div>
    </nav>
  );
};
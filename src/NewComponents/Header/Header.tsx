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
                    bg-gradient-to-b from-graphite to-graphite/80 border-b border-lightstone/10
                    backdrop-blur-sm">
      <Link to="/" className="text-2xl font-brown-sugar text-desertclay cursor-pointer
                    transition-transform duration-300 hover:scale-105
                    drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
        DAOBITAT
      </Link>

      <div className="hidden md:flex gap-8">
        {navItems.map(item => (
          <div
            key={item}
            className="text-milk font-helvetica hover:text-desertclay cursor-pointer
                     relative after:content-[''] after:absolute after:w-0 after:h-0.5
                     after:bg-desertclay after:left-1/2 after:-bottom-1.5
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
            className="px-4 py-2 border border-desertclay rounded-full text-milk
                     transition-all duration-300 hover:bg-desertclay hover:text-milk
                     hover:shadow-lg hover:shadow-desertclay/20"
          >
            Sign In
          </Link>
        ) : (
          <div
            onClick={handleUsernameClick}
            className="px-4 py-2 border border-desertclay rounded-full text-milk
                     transition-all duration-300 hover:bg-desertclay hover:text-milk
                     hover:shadow-lg hover:shadow-desertclay/20 cursor-pointer"
          >
            Hi, {user.name}
          </div>
        )}
      </div>
    </nav>
  );
};
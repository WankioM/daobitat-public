import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate(); 
  const socialLinks = [
    {
      name: 'Github',
      icon: <FiGithub className="w-5 h-5" />,
      url: 'https://github.com/WankioM'
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin className="w-5 h-5" />,
      url: 'https://www.linkedin.com/in/dao-bitat-096486335/?originalSubdomain=ke'
    },
    {
      name: 'X',
      icon: <FaXTwitter className="w-5 h-5" />,
      url: 'https://x.com/daobitat'
    }
  ];

  const handleContactClick = () => {
    navigate('/contactus');
  };

  return (
    <footer className="relative bg-graphite border-t border-lightstone/10">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-lightstone/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-desertclay/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connect Section */}
          <div className="space-y-6">
            <h3 className="text-desertclay text-2xl font-helvetica mb-4">
              Let's Connect
            </h3>
            <div className="flex flex-col space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 group 
                           text-milk/60 hover:text-desertclay transition-all duration-300
                           hover:translate-x-2"
                >
                  <span className="transition-colors duration-300 group-hover:text-desertclay">
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </a>
              ))}
              <a
                href="/contactus"
                className="flex items-center space-x-3 group 
                         text-milk/60 hover:text-desertclay transition-all duration-300
                         hover:translate-x-2"
              >
                <span>Contact Us</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-desertclay text-2xl font-helvetica mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['Buy', 'Rent', 'Sell', 'Advertise', 'Financing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-milk/60 hover:text-desertclay transition-colors duration-300
                           font-helvetica-light hover:translate-x-2 transform"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Credits */}
          <div className="space-y-6">
            <h3 className="text-desertclay text-2xl font-helvetica mb-4">
              Contact
            </h3>
            <div className="space-y-4">
              <p 
                onClick={handleContactClick}
                className="text-milk/60 font-helvetica-light cursor-pointer hover:text-desertclay transition-colors duration-300"
              >
                Email: contact@daobitat.com
              </p>
              <div className="pt-8 space-y-2">
                <p className="text-milk/40 font-helvetica-light text-sm">
                  Designed & Built by
                </p>
                <p className="text-desertclay font-helvetica">
                  DaoBitat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-lightstone/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-milk/40 font-helvetica-light text-sm">
              {new Date().getFullYear()} DAOBITAT. All rights reserved.
            </p>
            <p className="text-milk/40 font-helvetica-light text-sm">
              Powered by Blockchain
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
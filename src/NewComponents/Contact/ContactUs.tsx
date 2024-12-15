import React, { useEffect, useRef } from 'react';
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import anime from 'animejs';
import { Header } from '../Header/Header';
import Footer from '../Footer/Footer';

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

const ContactPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate the title with a slight bounce
    anime({
      targets: '.contact-title',
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 1200,
      easing: 'spring(1, 80, 10, 0)'
    });

    // Animate form elements with a cascade effect
    anime({
      targets: '.form-element',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutCubic'
    });

    // Animate social links with a slide effect
    anime({
      targets: '.social-link',
      translateX: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      duration: 600,
      easing: 'easeOutSine'
    });
  }, []);

  const socialLinks: SocialLink[] = [
    {
      name: 'Github',
      icon: <FiGithub className="w-5 h-5" />,
      url: 'https://github.com/WankioM'
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin className="w-5 h-5" />,
      url: 'https://www.linkedin.com/in/dao-bitat-096486335'
    },
    {
      name: 'X',
      icon: <FaXTwitter className="w-5 h-5" />,
      url: 'https://x.com/daobitat'
    }
  ];

  return (
    <div className="relative">
      <Header />
      <div ref={pageRef} className="h-[90vh] bg-pearl text-black overflow-y-auto">
        <div className="relative pt-16 px-6 md:px-12 lg:px-24">
          {/* Animated background gradients */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full animate-gradient-shift">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-licorice/5 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-licorice/5 to-transparent rounded-full blur-3xl animate-pulse-delayed" />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto relative">
            <h1 className="contact-title text-licorice text-5xl md:text-7xl font-helvetica mt-2 mb-12">
              Contact us
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="form-element space-y-4">
                  <h2 className="text-2xl text-licorice font-helvetica">Kenya Office</h2>
                  <div className="space-y-2 text-black/60 font-helvetica-light hover:text-black/80 transition-colors">
                    <p>Phone: +254 700 000 000</p>
                    <p>Email: contact@daobitat.com</p>
                    <p>Address: Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="form-element space-y-4">
                  <h2 className="text-2xl text-licorice font-helvetica">Social</h2>
                  <div className="space-y-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link flex items-center space-x-3 group text-black/60 hover:text-licorice transition-all duration-300 transform hover:translate-x-2"
                      >
                        <span className="transition-colors duration-300 group-hover:text-licorice">
                          {link.icon}
                        </span>
                        <span className="font-helvetica-light">{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="space-y-6">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-element space-y-2">
                    <label className="block text-licorice font-helvetica">Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/5 border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-licorice transition-all duration-300 text-black/80 font-helvetica-light hover:bg-black/10"
                    />
                  </div>

                  <div className="form-element space-y-2">
                    <label className="block text-licorice font-helvetica">Email</label>
                    <input
                      type="email"
                      className="w-full bg-black/5 border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-licorice transition-all duration-300 text-black/80 font-helvetica-light hover:bg-black/10"
                    />
                  </div>

                  <div className="form-element space-y-2">
                    <label className="block text-licorice font-helvetica">Message</label>
                    <textarea
                      rows={4}
                      className="w-full bg-black/5 border black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-licorice transition-all duration-300 text-black/80 font-helvetica-light hover:bg-black/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="form-element w-full bg-licorice text-[#24191E] font-helvetica py-3 rounded-lg hover:bg-[#a0d4b5] transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
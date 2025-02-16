import React from 'react';
import { Header } from '../Header/Header';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100">
      <Header />
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-graphite mb-8">About DaoBitat</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-graphite mb-4">Our Mission</h2>
              <p className="text-gray-700">
                DaoBitat is revolutionizing the real estate industry by creating a decentralized, 
                transparent, and efficient marketplace for property transactions. We believe in 
                making real estate accessible to everyone while maintaining the highest standards 
                of security and trust.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-graphite mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Seamless property listing and discovery</li>
                <li>Secure and transparent transactions</li>
                <li>Advanced property search and filtering</li>
                <li>Professional real estate services</li>
                <li>Innovative financing solutions</li>
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-graphite mb-4">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-desertclay">Transparency</h3>
                  <p className="text-gray-700">We believe in complete transparency in all our operations and transactions.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-desertclay">Innovation</h3>
                  <p className="text-gray-700">We continuously strive to improve and innovate in the real estate space.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-desertclay">Community</h3>
                  <p className="text-gray-700">We build strong communities through reliable real estate solutions.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-desertclay">Excellence</h3>
                  <p className="text-gray-700">We maintain the highest standards in all our services and operations.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

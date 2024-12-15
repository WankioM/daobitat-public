import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHandshake,
  FaHome,
  FaShieldAlt,
  FaChartLine,
  FaExchangeAlt,
  FaCubes,
  FaUniversity,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

const EscrowProcess: FC = () => {
  const sections = [
    {
      id: 1,
      title: 'General Escrow Management',
      description: 'DAO-Bitat acts as an intermediary to hold and manage funds during property-related transactions to ensure transparency, security, and fairness for all parties involved.',
      icon: <FaHandshake className="w-8 h-8" />,
      color: 'celadon',
      highlight: 'Secure Intermediary'
    },
    {
      id: 2,
      title: 'Rental Payment Protection',
      description: 'Platform holds rental payments in escrow until tenants have moved in, ensuring accountability and preventing fraudulent activities on both ends.',
      icon: <FaHome className="w-8 h-8" />,
      color: '#e49ab0',
      highlight: 'Verified Transactions'
    },
    {
      id: 3,
      title: 'Security Deposit Management',
      description: 'Security deposits are collected and invested in low-risk financial instruments. Upon lease termination, deposits plus accrued interest are returned or used for damages.',
      icon: <FaShieldAlt className="w-8 h-8" />,
      color: 'celadon',
      subFeatures: [
        'Interest-bearing deposits',
        'Fair damage assessment',
        'Automated refunds'
      ]
    },
    {
      id: 4,
      title: 'Investment of Idle Funds',
      description: 'Idle funds like deposits are actively invested to generate returns, benefiting both renters and property owners through increased value over time.',
      icon: <FaChartLine className="w-8 h-8" />,
      color: '#e49ab0',
      highlight: 'Passive Returns'
    },
    {
      id: 5,
      title: 'Real Estate Transaction Support',
      description: 'Comprehensive escrow services for property sales, shared ownership management, and loan repayment processing with automated fund routing.',
      icon: <FaExchangeAlt className="w-8 h-8" />,
      color: 'celadon',
      subFeatures: [
        'Property purchase protection',
        'Fractional ownership support',
        'Loan repayment management'
      ]
    },
    {
      id: 6,
      title: 'DeFi Integration',
      description: 'Leveraging decentralized finance protocols for enhanced transparency, automated processes, and improved trust within the ecosystem.',
      icon: <FaCubes className="w-8 h-8" />,
      color: '#e49ab0',
      highlight: 'Blockchain Powered'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-isabelline text-licorice overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-24 mb-16 px-4 relative"
      >
        {/* Background Gradient Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-celadon/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-slategray/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <motion.h1 
          className="font-helvetica-regular text-licorice text-5xl sm:text-6xl font-bold leading-tight tracking-[-0.033em] mb-6 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Escrow Services
        </motion.h1>
        <motion.p 
          className="text-licorice/80 text-lg mb-8 font-helvetica-light relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Secure, transparent, and efficient fund management
        </motion.p>
        <motion.div 
          className="w-24 h-1 bg-celadon mx-auto relative"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="relative">
          {/* Animated Timeline Line */}
          <motion.div 
            className="absolute left-[50%] top-0 bottom-0 w-px bg-licorice/20"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 last:mb-0"
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Animated Timeline Node */}
              <motion.div 
                className="absolute left-[50%] top-0 transform -translate-x-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
              >
                <div 
                  className={`w-12 h-12 rounded-full bg-isabelline border-2 flex items-center justify-center
                           shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1),_inset_2px_2px_4px_rgba(255,255,255,0.5)]`}
                  style={{ borderColor: section.color }}
                >
                  <motion.span 
                    className="text-licorice font-helvetica-regular font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {section.id}
                  </motion.span>
                </div>
              </motion.div>

              {/* Content Card */}
              <div className={`lg:col-span-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-24' : 'lg:col-start-2 lg:pl-24'}`}>
                <motion.div
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  className={`
                    bg-isabelline/40 backdrop-blur-sm 
                    border border-licorice/10 rounded-2xl p-8
                    shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.5)]
                    relative overflow-hidden
                    transition-all duration-300
                  `}
                >
                  {/* Animated Gradient Orb */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute -z-10 w-32 h-32 rounded-full blur-xl
                              top-1/2 transform -translate-y-1/2`}
                    style={{ backgroundColor: `${section.color}20` }}
                  />

                  <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <motion.div 
                      className="text-slategray"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {section.icon}
                    </motion.div>
                    <h3 className="font-helvetica-regular text-licorice text-2xl font-bold">{section.title}</h3>
                  </div>
                  
                  <p className={`text-licorice/80 leading-relaxed font-helvetica-light ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                    {section.description}
                  </p>

                  {section.subFeatures && (
                    <ul className={`mt-4 space-y-2 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                      {section.subFeatures.map((feature, i) => (
                        <li key={i} className="text-licorice/70 font-helvetica-light">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlight && (
                    <motion.div 
                      className={`mt-4 inline-block ${index % 2 === 0 ? 'lg:float-right' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="px-3 py-1 rounded-full text-sm font-helvetica-regular bg-celadon/10 text-slategray">
                        {section.highlight}
                      </span>
                    </motion.div>
                  )}

                  {/* Direction Indicators */}
                  <motion.div 
                    className={`absolute ${index % 2 === 0 ? 'right-4' : 'left-4'} bottom-4 text-slategray/50`}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {index % 2 === 0 ? <FaArrowLeft /> : <FaArrowRight />}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EscrowProcess;
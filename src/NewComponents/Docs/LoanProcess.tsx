import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileAlt, 
  FaCheckCircle, 
  FaWallet, 
  FaList, 
  FaHandshake, 
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

const LoanProcess: FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Documentation Preparation',
      description: `Submit your property deed, title documentation, recent professional appraisal report, and proof of ownership verification. We'll help create a digital representation of your property ownership.`,
      icon: <FaFileAlt className="w-8 h-8" />,
      color: '#b7e3cc'
    },
    {
      id: 2,
      title: 'DaoBitat Verification',
      description: 'Our team reviews and confirms all submitted documentation to ensure compliance and accuracy.',
      icon: <FaCheckCircle className="w-8 h-8" />,
      color: '#e49ab0'
    },
    {
      id: 3,
      title: 'Connect Wallet',
      description: 'Connect your digital wallet to begin the property listing process on our platform.',
      icon: <FaWallet className="w-8 h-8" />,
      color: '#b7e3cc'
    },
    {
      id: 4,
      title: 'On-Chain Listing',
      description: 'List your property on the blockchain with specified terms, loan-to-value ratios, and interest rates.',
      icon: <FaList className="w-8 h-8" />,
      color: '#e49ab0'
    },
    {
      id: 5,
      title: 'Accept Terms',
      description: 'Review and accept lending terms. Smart contract automatically sets up your repayment schedule.',
      icon: <FaHandshake className="w-8 h-8" />,
      color: '#b7e3cc'
    },
    {
      id: 6,
      title: 'Receive Credit',
      description: 'Once matched with a buyer, receive your credit directly through the smart contract.',
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      color: '#e49ab0'
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
    <div className="min-h-screen bg-isabelline overflow-hidden">
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
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-licorice/20 to-transparent rounded-full blur-3xl"
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
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#e49ab0]/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <motion.h1 
          className="font-[Helvetica-Regular] text-licorice text-5xl sm:text-6xl font-bold leading-tight tracking-[-0.033em] mb-6 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loan Process
        </motion.h1>
        <motion.p 
          className="text-black/80 text-lg mb-8 font-[Helvetica Light-Regular] relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your journey to property-backed lending
        </motion.p>
        <motion.div 
          className="w-24 h-1 bg-licorice mx-auto relative"
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

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
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
                  className={`w-12 h-12 rounded-full bg-[#24191E] border-2 flex items-center justify-center
                           shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.1),_inset_2px_2px_4px_rgba(0,0,0,0.5)]`}
                  style={{ borderColor: step.color }}
                >
                  <motion.span 
                    className="text-licorice font-[Helvetica-Regular] font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {step.id}
                  </motion.span>
                </div>
              </motion.div>

              {/* Content Card */}
              <div className={`lg:col-span-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-24' : 'lg:col-start-2 lg:pl-24'}`}>
                <motion.div
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  className={`
                    bg-[#24191E]/40 backdrop-blur-sm 
                    border border-black/10 rounded-2xl p-8
                    shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)]
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
                    style={{ backgroundColor: `${step.color}20` }}
                  />

                  <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <motion.div 
                      className="text-licorice"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="font-[Helvetica-Regular] text-black text-2xl font-bold">{step.title}</h3>
                  </div>
                  
                  <p className={`text-black/80 leading-relaxed font-[Helvetica Light-Regular] ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                    {step.description}
                  </p>

                  {/* Direction Indicators */}
                  <motion.div 
                    className={`absolute ${index % 2 === 0 ? 'right-4' : 'left-4'} bottom-4 text-licorice/50`}
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

export default LoanProcess;
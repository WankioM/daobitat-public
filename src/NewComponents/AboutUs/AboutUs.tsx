import { useState } from "react"
import {
  FaBolt,
  FaShieldAlt,
  FaStar,
  FaRocket,
  FaHeadphones,
  FaChevronDown,
  FaChevronUp,
  FaExchangeAlt,
  FaFileContract,
  FaUserFriends,
  FaGamepad,
  FaHome,
  FaCoins,
  FaLock,
  FaQuestion,
  FaCheck,
  FaBuilding
} from "react-icons/fa"
import { motion } from "framer-motion"

export default function AboutUs() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const features = [
    {
      icon: FaHome,
      title: "Verified On-Chain Listings",
      description: "Property listings are securely stored and verified on the blockchain, ensuring that all information is accurate and tamper-proof, giving renters confidence in the legitimacy of the property."
    },
    {
      icon: FaLock,
      title: "Secure Blockchain-Powered Escrow System",
      description: "Daobitat's escrow system holds deposits safely until the conditions of the rental agreement are met, ensuring both renters and landlords are protected from fraud.",
    },
    {
      icon: FaFileContract,
      title: "Smart Contract Automation",
      description: "Lease agreements and ownership transfers are fully automated through smart contracts, eliminating the need for intermediaries and reducing the risk of miscommunication or fraud in transactions."
    },
    {
      icon: FaCoins,
      title: "Payment History & Identity Verification",
      description: "Property owners can access the payment history of potential tenants and verify their identity, ensuring they select trustworthy tenants and minimize the risk of late or missed payments."
    },
    {
      icon: FaBuilding,
      title: "Property Visibility & Management",
      description: "Listers benefit from increased visibility for their properties, with easy tools to manage multiple listings, view tenant applications, and schedule showings directly through the platform.",
    },
  ]

  const steps = [
    {
      title: "Sign Up & Log In",
      description: "Easily create a crypto enabled account hasle free.",
      icon: FaUserFriends
    },
    {
      title: "Browse Verified Properties",
      description: "Only Trusted properties displayed for you to see.",
      icon: FaHome
    },
    {
      title: "Make an Offer & Enter Agreement",
      description: "Securely make the lease agreement official",
      icon: FaFileContract
    },
    {
      title: "Process Payment Through Escrow",
      description: "Ensures you have peace of mind as you wait for your transaction to be completed",
      icon: FaCoins
    },
    {
      title: "Move In Securely",
      description: "All boxes ticked, you can now take ownership of your new home.",
      icon: FaCheck
    },
    {
      title: "Ongoing Support & Property Management",
      description: "Easily have any additional services on your home managed online.",
      icon: FaHeadphones
    },
  ]

  const smartContracts = [
    {
      icon: FaExchangeAlt,
      title: "Property Registry Contract",
      description: "Handles property listings and ownership records, stores property metadata and verification status"
    },
    {
      icon: FaFileContract,
      title: "Escrow Contract",
      description: "Manages security deposits and rent payments, Holds funds in escrow until conditions are met and Handles automated rent disbursement."
    },
    {
      icon: FaUserFriends,
      title: "Tenancy Agreement Contract",
      description: "Manages rental agreements and terms, Stores tenant history and payment records and Handles lease signing and renewals."
    },
    {
      icon: FaGamepad,
      title: "Access Control Contract",
      description: "Manages user roles, Handles identity verification and Controls permissions for various operations."
    },
  ]

  const faqs = [
    {
      question: "What is blockchain in real estate?",
      answer: "Blockchain in real estate refers to the use of distributed ledger technology to securely record, store, and verify property transactions. It enables transparent, immutable records of ownership and can streamline processes like title transfers, escrow, and payments."
    },
    {
      question: "How does the Daobitat escrow system work?",
      answer: "Our escrow system holds funds in smart contracts until all conditions of a rental agreement are fulfilled. When both parties confirm that conditions are met, the funds are automatically released to the appropriate recipient, eliminating the need for a traditional escrow agent and reducing costs."
    },
    {
      question: "Is my personal information secure on Daobitat?",
      answer: "Yes, we employ advanced encryption and secure blockchain technology to protect your personal information. While your transaction history is recorded on the blockchain for verification purposes, personal identifying information is kept secure and private."
    },
    {
      question: "What types of properties are available on Daobitat?",
      answer: "Daobitat supports a wide range of property types including residential rentals, commercial spaces, vacation rentals, and even certain types of property ownership transfers. All properties undergo a verification process to ensure legitimacy."
    },
    {
      question: "Do I need cryptocurrency to use Daobitat?",
      answer: "While Daobitat operates on blockchain technology, we support both traditional payment methods and cryptocurrency. Users can choose their preferred payment method when setting up transactions."
    },
    {
      question: "How are disputes handled between renters and landlords?",
      answer: "Daobitat includes a built-in dispute resolution system. Issues are first addressed through an automated mediation process guided by smart contract parameters. If unresolved, disputes can be escalated to our arbitration panel of real estate and blockchain experts."
    },
  ]

  return (
    <div className="bg-gradient-to-b from-[#f9f7f0] to-white">
      {/* Hero Section */}
      <section className="relative bg-[#2c3e50] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Revolutionizing Real Estate with Blockchain
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              DaoBitat is a decentralized property listing platform with verified onchain listings, and an escrow payment system to safeguard real estate transactions. Our Blockchain-powered escrow ensures deposits are untouchable until conditions are met, while smart contracts automate trust in ownership and lease agreements.
            </motion.p>
            <motion.button
              className="bg-[#b17457] hover:bg-[#9a6349] text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore Properties
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h6 className="text-[#b17457] uppercase tracking-wider font-semibold mb-2">Our Features</h6>
            <h2 className="text-4xl font-bold text-[#2c3e50]">What Makes Daobitat Different</h2>
            <div className="w-24 h-1 bg-[#b17457] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-8">
                  <div className="bg-[#f9f7f0] inline-block p-3 rounded-lg mb-6">
                    <feature.icon className="h-8 w-8 text-[#b17457]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2c3e50] mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#f9f7f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h6 className="text-[#b17457] uppercase tracking-wider font-semibold mb-2">Process</h6>
            <h2 className="text-4xl font-bold text-[#2c3e50]">How It Works</h2>
            <div className="w-24 h-1 bg-[#b17457] mx-auto mt-4"></div>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#b17457] transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-center bg-[#b17457] w-12 h-12 rounded-full mb-6 mx-auto text-white">
                      {index + 1}
                    </div>
                    <div className="text-center">
                      <div className="bg-[#f9f7f0] inline-block p-3 rounded-full mb-4">
                        <step.icon className="h-6 w-6 text-[#b17457]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#2c3e50] mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Smart Contracts Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h6 className="text-[#b17457] uppercase tracking-wider font-semibold mb-2">Technology</h6>
            <h2 className="text-4xl font-bold text-[#2c3e50]">Our Smart Contracts</h2>
            <div className="w-24 h-1 bg-[#b17457] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {smartContracts.map((contract, index) => (
              <motion.div
                key={index}
                className="bg-[#f9f7f0] rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-8 flex items-start">
                  <div className="bg-white p-4 rounded-lg shadow-sm mr-6">
                    <contract.icon className="h-8 w-8 text-[#b17457]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2c3e50] mb-3">{contract.title}</h3>
                    <p className="text-gray-600">{contract.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#f9f7f0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h6 className="text-[#b17457] uppercase tracking-wider font-semibold mb-2">Questions & Answers</h6>
            <h2 className="text-4xl font-bold text-[#2c3e50]">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-[#b17457] mx-auto mt-4"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className={`w-full text-left p-6 flex items-center justify-between rounded-lg ${
                    expandedFaq === index ? 'bg-white shadow-md' : 'bg-white/50 hover:bg-white/80'
                  } transition-all duration-200`}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex items-center">
                    <FaQuestion className="text-[#b17457] mr-4 flex-shrink-0" />
                    <span className="font-semibold text-[#2c3e50]">{faq.question}</span>
                  </div>
                  {expandedFaq === index ? (
                    <FaChevronUp className="text-[#b17457]" />
                  ) : (
                    <FaChevronDown className="text-[#b17457]" />
                  )}
                </button>

                {expandedFaq === index && (
                  <motion.div
                    className="bg-white p-6 rounded-b-lg shadow-md mt-1 text-gray-600"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#2c3e50] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Real Estate Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join the future of property rentals and management with our secure, transparent blockchain platform.
          </p>
          <button className="bg-[#b17457] hover:bg-[#9a6349] text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}

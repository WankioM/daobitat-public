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
} from "react-icons/fa"

export default function AboutUs() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)

  const features = [
    { icon: FaBolt, title: "Verified On-Chain Listings", description: "Property listings are securely stored and verified on the blockchain, ensuring that all information is accurate and tamper-proof, giving renters confidence in the legitimacy of the property." },
    {
      icon: FaShieldAlt,
      title: "Secure Blockchain-Powered Escrow System",
      description: "Daobitat’s escrow system holds deposits safely until the conditions of the rental agreement are met, ensuring both renters and landlords are protected from fraud.",
    },
    { icon: FaStar, title: "Smart Contract Automation", description: "Lease agreements and ownership transfers are fully automated through smart contracts, eliminating the need for intermediaries and reducing the risk of miscommunication or fraud in transactions." },
    { icon: FaRocket, title: "Payment History & Identity Verification", description: "Property owners can access the payment history of potential tenants and verify their identity, ensuring they select trustworthy tenants and minimize the risk of late or missed payments." },
    {
      icon: FaHeadphones,
      title: "Property Visibility & Management",
      description: "Listers benefit from increased visibility for their properties, with easy tools to manage multiple listings, view tenant applications, and schedule showings directly through the platform.",
    },
  ]

  const steps = [
    {
      title: "Sign Up & Log In",
      description: "Create an account quickly and securely via email, with the option for easy logins using account abstraction. Once registered, you can securely manage your property listings or rental inquiries.",
    },
    {
      title: "Browse Verified Properties",
      description: "Explore a wide range of properties with confidence. All listings are verified on the blockchain, ensuring that the details are accurate and trustworthy. Each property includes clear images, videos, and verified ownership information.",
    },
    {
      title: "Make an Offer & Enter Agreement",
      description: "When you find the right property, submit an offer to the landlord or property owner. Once terms are agreed upon, both parties enter into a smart contract that outlines the lease or sale conditions, ensuring full transparency and mutual trust.",
    },
    {
      title: "Process Payment Through Escrow",
      description: "Your payment is securely processed via Daobitat’s blockchain-powered escrow system. The deposit and first month’s rent are held in escrow until all contract terms are met, ensuring that both parties are protected throughout the transaction.",
    },
    {
      title: "Move In Securely",
      description: "After the contract conditions are fulfilled, the transaction is finalized, and the first month’s rent is released to the property owner. Renters can move in knowing that their deposit and payments are secure, and property owners can be assured of timely payment.",
    },
    {
      title: "Ongoing Support & Property Management",
      description: "Daobitat provides ongoing tools for property management. Owners can track payments, view tenant history, and manage multiple listings, while renters enjoy a safe and streamlined experience throughout their tenancy.",
    },
  ]

  const smartContracts = [
    {
      icon: FaExchangeAlt,
      title: "Property Registry Contract",
      description: "Handles property listings and ownership records, stores property metadata and verification status",
    },
    {
      icon: FaFileContract,
      title: "Escrow Contract",
      description: "Manages security deposits and rent payments, Holds funds in escrow until conditions are met and Handles automated rent disbursement, Hold funds in a secure third-party account until conditions are met.",
    },
    {
      icon: FaUserFriends,
      title: "Tenancy Agreement Contract",
      description: "Manages rental agreements and terms, Stores tenant history and payment records and Handles lease signing and renewals.",
    },
    {
      icon: FaGamepad,
      title: "Access Control Contract",
      description: "Manages user roles, Handles identity verification and Controls permissions for various operations.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#b17457]">Aboutgit  Daobitat</h1>
        <p className="text-xl text-[#4a4947]">
          DaoBitat is a decentralized property listing platform with verified onchain listings, and an escrow payment system to safeguard real estate transactions. Our Blockchain-powered escrow ensures deposits are untouchable until conditions are met, while smart contracts automate trust in ownership and lease agreements.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#b17457]">Product Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#f9f7f0] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <feature.icon className="h-6 w-6 mr-2 text-[#b17457]" />
                    <h3 className="text-xl font-semibold text-[#4a4947]">{feature.title}</h3>
                  </div>
                  <button
                    className="text-[#4a4947] hover:text-[#b17457] focus:outline-none"
                    onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                  >
                    {expandedFeature === index ? (
                      <FaChevronUp className="h-4 w-4" />
                    ) : (
                      <FaChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle feature description</span>
                  </button>
                </div>
                {expandedFeature === index && <p className="text-[#4a4947]">{feature.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#b17457]">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#f9f7f0] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#dbd2c2] text-[#4a4947] rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-[#4a4947]">{step.title}</h3>
                </div>
                <p className="text-[#4a4947]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-[#b17457]">Types of Smart Contracts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {smartContracts.map((contract, index) => (
            <div key={index} className="bg-[#f9f7f0] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <contract.icon className="h-8 w-8 mr-3 text-[#b17457]" />
                  <h3 className="text-xl font-semibold text-[#4a4947]">{contract.title}</h3>
                </div>
                <p className="text-[#4a4947]">{contract.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

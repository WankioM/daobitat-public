# DAO-Bitat: Revolutionizing Real Estate with Blockchain Technology



## 📝 Overview

DAO-Bitat is a decentralized property listing platform that transforms the real estate marketplace through blockchain technology. Our solution creates a secure, transparent, and efficient ecosystem for property transactions, addressing critical industry challenges while making property investment accessible to small investors through tokenization.

## 🔗 Quick Links

- **[Live Platform](https://daobitat.io)** - Test the working beta version
- **[Documentation](https://www.canva.com/design/DAGg5X83YDw/n6FgbURM4zmzyQua9yt4AA/view)** - Comprehensive platform guide
- **[Pitch Deck](https://www.canva.com/design/DAGdxONjAcA/jvq4OoHpdLeEehMs_jcZBA/view)** - Project presentation
- **[Linktree](https://linktr.ee/daobitat)** - All resources in one place
- **[GitHub Repository](https://github.com/WankioM/daobitat-public)** - Public frontend code

## 🔍 The Problem

The real estate market, particularly in Kenya and across Africa, faces significant challenges:

- **Rampant Fraud**: 1 in every 5 real estate transactions is fraudulent
- **Time Inefficiency**: Acquiring a new home takes 2-5 months
- **Price Inflation**: Purchase prices are 5.2% higher than necessary (Hass Consult 2023)
- **Lack of Transparency**: Property owners struggle with visibility throughout transactions
- **Trust Deficit**: Unreliable verification systems leave buyers and renters vulnerable

These problems create friction, increase costs, and undermine trust in the real estate market.

## 💡 Our Solution

DAO-Bitat provides a blockchain-powered platform connecting property seekers directly with verified owners and agents through:

### Core Features

- **Verified Property Listings**: On-chain verification ensuring authenticity
- **Secure Escrow System**: Blockchain-based protection for deposits and payments
- **Smart Contract Management**: Automated agreements and transaction execution
- **Property History Tracking**: Immutable record of property transactions
- **Fractional Ownership**: Tokenization making property investment accessible
- **Seamless User Experience**: Intuitive interface for all user knowledge levels

## 🏗️ Technical Architecture

### Technology Stack

- **Frontend**: React with responsive design for all device sizes
- **Backend**: MongoDB for flexible, scalable document storage
- **Blockchain Integration**: Smart contracts for escrow and verification
- **Cloud Infrastructure**: Google Cloud for reliable, secure hosting
- **Mapping**: Google Maps API for precise property location visualization

### Data Model

Our platform utilizes four primary MongoDB collections:
- **Properties**: Comprehensive property details and metrics
- **Users**: User profiles with role-based permissions
- **Messages**: Communication between users
- **Offers**: Structured property offer details and status

## ⛓️ Smart Contracts

### Deployed Contracts

1. PropertySBT (Soulbound Token)
Contract Address: 0x8b36a06aed7399215ccd885c84129f693b06e4d2
The PropertySBT contract creates immutable identity tokens for each property, representing the fundamental identity that cannot be transferred. This ensures that every property has a permanent, verifiable record on the blockchain.
Key Features:

Immutable property identification
Stores essential property metadata (location, type, geohash)
Links MongoDB property IDs to blockchain records
Cannot be transferred (soulbound nature)

2. PropertyOwnershipNFT
Contract Address: 0x436aF69eDCc1eD181705e9CED981746b85a0D76E
A transferable ERC-721 NFT that represents actual ownership rights to a property. Unlike the SBT, these tokens can be transferred to represent changes in ownership.
Key Features:

Transferable ownership representation
Complete transfer history tracking
Metadata management for ownership documents
Integration with escrow for secure transfers

3. PropertyRegistry (Central Coordinator)
Contract Address: 0xf8790442f9fac3d3c3c016bd785021858c2d5a7c
The central hub that coordinates interactions between all property-related contracts. It manages the relationship between SBTs, ownership NFTs, and verification status.
Key Features:

Unified property registration system
Property verification management
Ownership transfer coordination
Metadata synchronization across contracts

4. RentalEscrow (Payment Management)
Contract Address: 0xa87fB252736E0D71C561E5167b0b47960785bCc6
A sophisticated escrow system that manages rental agreements, payments, and disputes with automated billing cycles and security deposit handling.
Key Features:

Automated rental payment processing
Security deposit management
Dispute resolution system
Multi-cycle billing automation
Early lease termination support

Contract Integration Flow
mermaidgraph TD
    A[Property Registration] --> B[PropertyRegistry]
    B --> C[PropertySBT Minting]
    B --> D[PropertyOwnershipNFT Minting]
    B --> E[Property Verification]
    
    F[Rental Agreement] --> G[RentalEscrow Creation]
    G --> H[Escrow Funding]
    H --> I[Move-in Confirmation]
    I --> J[Automated Billing Cycles]
    
    K[Ownership Transfer] --> B
    B --> L[NFT Transfer via Registry]
    
    M[Dispute Resolution] --> G

### Planned Contract Deployments

1. **Tenancy Agreement Contract**
   - Manages digital rental agreements
   - Automates lease signing and renewals
   - Stores tenant history and payment records
   - Key functions: `createAgreement()`, `signLease()`, `terminateLease()`

2. **Access Control Contract**
   - Manages user roles and permissions
   - Handles identity verification
   - Controls access to platform features
   - Key functions: `verifyIdentity()`, `assignRole()`, `checkPermission()`

3. **Governance Contract**
   - Enables decentralized decision-making
   - Manages protocol upgrades
   - Controls fee structures
   - Key functions: `propose()`, `vote()`, `execute()`

## 🚀 Market Strategy

Our go-to-market approach focuses on:

1. **Agent-First Approach**
   - Targeting real estate agents as early adopters
   - Building inventory through verified property listings

2. **Incentivization Programs**
   - Referral campaigns for organic growth
   - Rewards for property verification and transactions

3. **Target Market**
   - 20,000 monthly home seekers in Kenya
   - Total Addressable Market: $21.92T (Africa Real Estate Market by 2029)
   - Serviceable Obtainable Market: $41M (2% of Kenya's land and residential market)

## 🛣️ Roadmap

- **Current Stage**: Development of prototype with first 100 listings
- **Q2 2025**: Official platform launch
- **Q3 2025**: Expansion to additional regions
- **Future Development**:
  - Enhanced property tokenization features
  - Decentralized governance for property management
  - Property-backed lending system integration
  - Advanced collateral management protocols

## 💪 Unique Value Proposition

DAO-Bitat is transforming real estate transactions by bringing blockchain security, transparency, and efficiency to everyday users. We're creating a trustworthy ecosystem where finding and securing a home is no longer plagued by fraud, delays, and inflated costs.

---

*DAO-Bitat - Democratizing Access to Real Estate Investment*

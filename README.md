# DAO-Bitat Platform

![DAO-Bitat Banner](https://your-image-url.com/banner.png)

## Project Repositories

This project is split across three repositories:

1. **Frontend (Current Repository)**: [daobitat-public](https://github.com/WankioM/daobitat-public)
   - Main public repository containing the user interface and client-side logic

2. **Backend**: [daobitat-backend](https://github.com/WankioM/daobitat-backend)
   - Backend repository (temporarily public)
   - Contains API endpoints, database management, and server-side logic

3. **Smart Contracts**: [daobitat-starknet-contract](https://github.com/WankioM/daobitat-starknet-contract)
   - StarkNet smart contracts for property management and transactions

DAO-Bitat is a decentralized property listing platform that revolutionizes real estate investing through blockchain technology. Our platform brings transparency, accessibility, and democratization to real estate investments by enabling fractional ownership of Real World Assets (RWA).

## 🌟 Features

### For Property Seekers
- Secure property search and verification
- Real-time messaging with property owners
- Wallet integration (Braavos, Argent)
- Property viewing scheduling
- Smart contract-based agreements
- Wishlist management

### For Property Owners
- Tenant payment history verification
- Multi-property management dashboard
- Enhanced property visibility
- Automated showing scheduling
- Direct negotiation platform
- Secure rent collection

## 🏗 Architecture

### Frontend (React + TypeScript)
- Google OAuth integration
- Responsive dashboard interfaces
- Real-time messaging system
- Interactive property maps
- Tailwind CSS styling
- Context-based state management

### Backend (Node.js + Express)
- JWT authentication
- Role-based access control
- MongoDB integration
- Firebase Admin SDK
- File upload handling
- RESTful API endpoints

### Blockchain Integration
- StarkNet smart contracts
- Property tokenization
- Secure transactions
- Ownership verification
- Digital wallet integration (Braavos, Argent)
## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Firebase Account
- Google OAuth Credentials
- Stellar Account

### Environment Variables

```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FIREBASE_ADMIN_KEY=path_to_firebase_key

# Frontend (.env)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=your_api_url
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/daobitat.git
cd daobitat
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Start the development servers
```bash
# Backend
npm run dev

# Frontend
npm start
```

## 📱 Key Components

### Authentication System
- Google OAuth integration
- Digital wallet connection
- JWT token management
- Role-based access

### Property Management
- Property listing CRUD operations
- Image upload and management
- Search and filtering
- Location mapping

### Messaging System
- Real-time chat functionality
- Property inquiries
- Viewing scheduling
- Notification system

### Transaction System
- Smart contract integration
- Payment processing
- Escrow management
- Transaction history

## 🔒 Security Features

- JWT middleware for protected routes
- Refresh token rotation
- Rate limiting
- Request sanitization
- CORS configuration
- Helmet.js security headers
- API key management

## 💾 Database Design

### MongoDB Collections
- Users
- Properties
- Messages
- Transactions
- Bookings
- Wishlists

### Optimization
- Connection pooling
- Redis caching
- Database indexing
- Migration system

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- @react-oauth/google
- React Router
- Context API

### Backend
- Node.js
- Express
- MongoDB
- Firebase Admin
- JWT
- Stellar SDK

### DevOps
- Docker
- GitHub Actions
- PM2
- Winston Logger

## 📚 API Documentation

### Authentication Routes
```typescript
POST /auth/google    // Google OAuth
POST /auth/wallet    // Wallet connection
POST /auth/phone     // Phone verification
```

### Property Routes
```typescript
GET    /api/properties      // List properties
POST   /api/properties      // Create property
PUT    /api/properties/:id  // Update property
DELETE /api/properties/:id  // Delete property
```

### User Routes
```typescript
GET    /users/profile      // Get user profile
PUT    /users/profile      // Update profile
DELETE /users/account      // Delete account
```


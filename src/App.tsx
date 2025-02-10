import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignIn from './NewComponents/SignIn/SignIn';
import SignUpContainer from './NewComponents/SignUp/SignUp';
import { UserProvider } from './NewContexts/UserContext';
import { LandingPage } from './NewComponents/LandingPage/LandingPage';
import SignUp2 from './NewComponents/SignUp/SignUp';
import ListerDashBoard from './NewComponents/ListerDashBoard/ListerDashBoard';

import Billings from './NewComponents/ListerDashBoard/Billings/Billings';
import Map from './NewComponents/Maps/Map';
import ContactPage from './NewComponents/Contact/ContactUs';
import PropertyTab from './NewComponents/Recommendations/PropertyTab/PropertyTab';


const App: React.FC = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.error('Google Client ID is not defined in environment variables');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<Map />} />
            <Route path="/contactus" element={<ContactPage />} />
            <Route path="/property/:id" element={<PropertyTab />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUpContainer />} />
            <Route path="/listerdashboard" element={<ListerDashBoard />} />
            <Route path="/billings" element={<Billings />} />
          </Routes>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
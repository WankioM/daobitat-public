import React, { useEffect, useState } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useUser } from '../../../../contexts/UserContext';
import { firestore } from '../../../../firebaseConfig';
import './ConnectWallet.css';

const ConnectBaseSmartWallet: React.FC = () => {
  const { user } = useUser();
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coinbaseWallet, setCoinbaseWallet] = useState<any>(null);

  useEffect(() => {
    initializeCoinbaseWallet();
    checkExistingWallet();
  }, [user]);

  const initializeCoinbaseWallet = () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'Your App Name',
      appLogoUrl: 'https://example.com/logo.png',
      
    });
    setCoinbaseWallet(coinbaseWallet);
  };

  const checkExistingWallet = async () => {
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        
        if (userData?.billing?.type === 'coinbaseSmartWallet' && userData?.billing?.walletAddress) {
          setAccount(userData.billing.walletAddress);
        }
      } catch (error) {
        console.error("Error checking existing wallet:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (!coinbaseWallet) {
        console.error("Coinbase Wallet SDK not initialized");
        return;
      }

      // Initialize the Coinbase Wallet provider
      const provider = coinbaseWallet.makeWeb3Provider('https://base-mainnet.g.alchemy.com/v2/YOUR-API-KEY', 8453);

      // This will trigger the Coinbase Wallet popup
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        console.log("Connected Coinbase Smart Wallet:", address);

        await updateFirestore(address);
      } else {
        throw new Error("No accounts returned from Coinbase Wallet");
      }
    } catch (error) {
      console.error("Failed to connect Coinbase Smart Wallet", error);
    }
  };

  const disconnectWallet = async () => {
    if (coinbaseWallet) {
      // Note: There's no built-in disconnect method in the SDK
      // We'll just clear the local state
      setCoinbaseWallet(null);
    }
    setAccount(null);

    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          'billing.type': null,
          'billing.walletAddress': null
        });
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  const updateFirestore = async (walletAddress: string) => {
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          billing: {
            type: 'coinbaseSmartWallet',
            walletAddress: walletAddress
          }
        });
        console.log("Wallet information updated in Firestore");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    } else {
      console.error("No authenticated user found");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {account ? (
        <div>
          <p>Connected: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Coinbase Smart Wallet</button>
        </div>
      ) : (
        
        <div onClick={connectWallet} className='walletdiv'>
          <img  
          className ='walletlogo'
          src='https://cdn.iconscout.com/icon/free/png-256/free-coinbase-logo-icon-download-in-svg-png-gif-file-formats--bitcoin-cryptocurrency-blockchain-currency-social-media-company-logos-pack-icons-6297189.png'></img> 
          <p>Smart Wallet</p></div>
      )}
    </div>
  );
};

export default ConnectBaseSmartWallet;
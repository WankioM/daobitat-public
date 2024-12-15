import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { BrowserProvider, Signer } from 'ethers';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useUser } from '../../../../contexts/UserContext';
import { firestore } from '../../../../firebaseConfig';
import './ConnectWallet.css';

const ConnectMetamask: React.FC = () => {
  const { user } = useUser();
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const modal = new Web3Modal({
      network: "mainnet", // Replace with your preferred network
      cacheProvider: true,
    });
    setWeb3Modal(modal);

    checkExistingWallet();
  }, [user]);

  const checkExistingWallet = async () => {
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        
        if (userData?.billing?.type === 'metamask' && userData?.billing?.walletAddress) {
          setAccount(userData.billing.walletAddress);
          if (web3Modal?.cachedProvider) {
            connectWallet();
          }
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
      if (!web3Modal || !user) return;

      const instance = await web3Modal.connect();
      const ethersProvider = new BrowserProvider(instance);
      setProvider(ethersProvider);

      const signer: Signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      console.log("Connected Wallet:", address);

      await updateFirestore(address);

    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  const disconnectWallet = async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    setProvider(null);
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
            type: 'metamask',
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
          <button onClick={disconnectWallet}>Disconnect Metamask</button>
        </div>
      ) : (
        <div onClick={connectWallet} className='walletdiv'>
          <img  className ='walletlogo' src='https://cdn.iconscout.com/icon/free/png-128/free-metamask-logo-icon-download-in-svg-png-gif-file-formats--browser-extension-chrome-logos-icons-2261817.png?f=webp'></img> 
          <p>Metamask</p></div>
      )}
    </div>
  );
};

export default ConnectMetamask;
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateLien.css';
import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs} from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useUser } from '../../contexts/UserContext'; 
import CertificateOfLienABI from '../certificateOfLienABI';

const CONTRACT_ADDRESS = '0x5BD51c30473CFCc8F5a27874dE5f9D105a8012d8';


interface CreateLienProps {
  onClose: () => void;
  propertyId: string;
  loanAmount: string;
  landPrice: string;
}

const CreateLienComponent: React.FC<CreateLienProps> = ({ onClose, propertyId, loanAmount, landPrice }) => {
  const [loanPeriod, setLoanPeriod] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useUser();

  const isValidEthValue = (value: string): boolean => {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && parsed > 0;
  };
  
  const formatEthValue = (value: string): string => {
    if (!isValidEthValue(value)) {
      return "Invalid Amount";
    }
    return parseFloat(value).toFixed(4);
  };


  const addLienToFirestore = async (tokenId: string, borrowerAddress: string) => {
    try {
      if (!isValidEthValue(loanAmount) || !isValidEthValue(landPrice)) {
        throw new Error("Invalid loan amount or land price");
      }

      const borrowerId = user.uid;

      const lienData = {
        tokenId,
        propertyId,
        borrowerAddress,
        borrowerId,
        loanAmount: parseFloat(loanAmount),
        landPrice: parseFloat(landPrice),
        loanPeriod,
        interestRate,
        createdAt: new Date(),
        status: 'in-marketplace'
      };

      const userUid = user.uid;

      // Update the existing loan request document
      const loanRequestRef = collection(firestore, 'financing', 'Requested loans', userUid);
      const q = query(loanRequestRef, where("propertyId", "==", propertyId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const loanDoc = querySnapshot.docs[0];
        await updateDoc(doc(firestore, 'financing', 'Requested loans', userUid, loanDoc.id), {
          status: 'in-marketplace',
          tokenId,
          borrowerAddress,
          borrowerId
        });
        console.log("Loan request updated in Firestore");
      } else {
        console.error("Loan request not found");
        throw new Error("Loan request not found");
      }

      // Add to marketplace collection
      const marketplaceRef = doc(collection(firestore, 'marketplace'));
      await setDoc(marketplaceRef, lienData);

      console.log("Lien added to Firestore and marketplace");
    } catch (error) {
      console.error("Error adding lien to Firestore:", error);
      throw error;
    }
  };


  const handleCreateLien = async () => {
    try {

      if (!isValidEthValue(loanAmount) || !isValidEthValue(landPrice)) {
        throw new Error("Invalid loan amount or land price");
      }

      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }
  
      // Base Sepolia chain ID
      const baseSepolia = '0x14A34';
  
      // Request network change to Base Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: baseSepolia }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: baseSepolia,
                  chainName: 'Base Sepolia',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia.basescan.org']
                },
              ],
            });

            setTimeout(() => {
              onClose();
            }, 1000);
          } catch (addError) {
            throw new Error("Failed to add Base Sepolia network to MetaMask");
          }
        } else {
          throw new Error("Failed to switch to Base Sepolia network");
        }
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateOfLienABI, signer);

      const balance = await provider.getBalance(await signer.getAddress());
      console.log("Account balance:", ethers.formatEther(balance), "ETH");

      const landPriceWei = ethers.parseEther(landPrice);
      const periodInSeconds = BigInt(parseInt(loanPeriod) * 24 * 60 * 60); // Convert days to seconds
      const interestRateScaled = BigInt(Math.floor(parseFloat(interestRate) * 100)); // Scale up by 100 for precision

      const collateralAmount = landPriceWei / BigInt(10); 

      const tx = await contract.createLien(landPriceWei, periodInSeconds, interestRateScaled, ethers.parseEther(loanAmount), {
        value: collateralAmount
      });
  
      setSuccess("Transaction sent! Waiting for confirmation...");
  
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
  
      // Detailed logging of the receipt
      console.log("Transaction hash:", receipt.hash);
      console.log("Block number:", receipt.blockNumber);
      console.log("From:", receipt.from);
      console.log("To:", receipt.to);
      console.log("Gas used:", receipt.gasUsed.toString());
  
      console.log("All logs:", receipt.logs);
  
      // Try multiple methods to find the LienCreated event
      let newTokenId;
  
      // Method 1: Using ethers.js Interface
      const interfacer = new ethers.Interface(CertificateOfLienABI);
      const lienCreatedEvent = receipt.logs
        .map((log: any) => {
          try {
            return interfacer.parseLog(log);
          } catch (error) {
            console.log("Error parsing log:", error);
            return null;
          }
        })
        .find((event: any) => event?.name === 'LienCreated');
  
      if (lienCreatedEvent && lienCreatedEvent.args) {
        newTokenId = lienCreatedEvent.args[0].toString();
        console.log("Method 1 - Found newTokenId:", newTokenId);
      }
  
      // Method 2: Manual parsing
      if (!newTokenId) {
        const lienCreatedLog = receipt.logs.find(
          (log: any) => log.topics[0] === ethers.id("LienCreated(uint256,address,address,uint256,uint256,uint256)")
        );
  
        if (lienCreatedLog) {
          const decodedLog = interfacer.parseLog({
            topics: lienCreatedLog.topics as string[],
            data: lienCreatedLog.data
          });
          if (decodedLog && decodedLog.args) {
            newTokenId = decodedLog.args[0].toString();
            console.log("Method 2 - Found newTokenId:", newTokenId);
          }
        }
      }
  
      // Method 3: Check receipt events directly
      if (!newTokenId && receipt.events) {
        const lienCreatedEvent = receipt.events.find((e: any) => e.event === 'LienCreated');
        if (lienCreatedEvent && lienCreatedEvent.args) {
          newTokenId = lienCreatedEvent.args[0].toString();
          console.log("Method 3 - Found newTokenId:", newTokenId);
        }
      }
  
      if (newTokenId) {
        const borrowerAddress = await signer.getAddress();
        await addLienToFirestore(newTokenId, borrowerAddress);
        setSuccess(`Lien created successfully! New Token ID: ${newTokenId}`);
      } else {
        console.error("Failed to retrieve newTokenId from any method");
        setSuccess("Lien created successfully, but couldn't retrieve New Token ID.");
      }
  
    } catch (err) {
      console.error("Error creating lien:", err);
      setError("Failed to create lien. Check console for details.");
    }
  };

  return (
    <div className="create-lien-component">
      <h2 className="title">Create Lien</h2>
      <div className="lien-info">
        <div className="info-item">
          <span className="label">Property ID:</span>
          <span className="value">{propertyId}</span>
        </div>
        <div className="info-item">
          <span className="label">Loan Amount:</span>
          <span className="value">{formatEthValue(loanAmount)} ETH</span>
        </div>
        <div className="info-item">
          <span className="label">Land Price:</span>
          <span className="value">{formatEthValue(landPrice)}ETH</span>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="loanPeriod">Loan Period (in days)</label>
        <input
          id="loanPeriod"
          type="number"
          min="1"
          max="365"
          value={loanPeriod}
          onChange={(e) => setLoanPeriod(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="interestRate">Suggested Interest Rate (%)</label>
        <input
          id="interestRate"
          type="number"
          step="0.01"
          min="0"
          max="50"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
      </div>
      <button 
  onClick={handleCreateLien } 
  className="submit-button"
  disabled={!isValidEthValue(loanAmount) || !isValidEthValue(landPrice)}
>
  Submit to Marketplace for Financing
</button>

      <button onClick={onClose} className="cancel-button">
        Cancel
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default CreateLienComponent;
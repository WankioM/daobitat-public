import React, { useState ,useEffect} from 'react';
import PriceRangeCheckboxes from './PriceRange';
import { FaSearch } from 'react-icons/fa';
import { collection, getDocs ,getDoc, doc,DocumentData,updateDoc} from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; 
import { ethers } from 'ethers';
import CertificateOfLienABI from '../certificateOfLienABI';


/*
interface NFTMetadata {
  name: string;
  description: string;
  image: string;

}

interface PropertyDetails {
  propertyName: string;
  location: string;
  price: string;
  images: string[];
  bedrooms: string;
  bathrooms: string;
  space: string;
  // Add other property details as needed
}

interface NFT {
  id: string;
  metadata: NFTMetadata;
  priceEth: string;
  datePosted: string;
  borrowerAddress: string;
  borrowerId: string;
  interestRate: string;
  landPrice: number;
  loanAmount: number;
  loanPeriod: string;
  propertyId: string;
  status: string;
  tokenId: string;
  propertyDetails: PropertyDetails;
}


interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

const CONTRACT_ADDRESS = '0x5BD51c30473CFCc8F5a27874dE5f9D105a8012d8';

const handleInvest = async (nft: NFT) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask!");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateOfLienABI, signer);

    // Get the latest lien details
    const lienDetails = await contract.getLienDetails(nft.tokenId);
    
    if (lienDetails.lender !== ethers.ZeroAddress) {
      throw new Error("This loan has already been funded");
    }

    // Convert loanAmount to wei
    const loanAmountWei = ethers.parseEther(nft.loanAmount.toString());

    // Send the transaction
    const tx = await contract.invest(nft.tokenId, { value: loanAmountWei });
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log("Investment successful", receipt);

    // Calculate repayment amount and period
    const interestRate = parseFloat(nft.interestRate) / 100; // Convert percentage to decimal
    const loanPeriodDays = parseInt(nft.loanPeriod);
    const repaymentAmount = nft.loanAmount * (1 + (interestRate * loanPeriodDays / 365));
    const repaymentDate = new Date();
    repaymentDate.setDate(repaymentDate.getDate() + loanPeriodDays);

    // Update Firestore
    const marketplaceRef = doc(firestore, 'marketplace', nft.id);
    await updateDoc(marketplaceRef, {
      lenderAddress: await signer.getAddress(),
      repaymentAmount: repaymentAmount,
      repaymentDate: repaymentDate,
      status: 'funded'
    });

    alert("Investment successful! Transaction hash: " + receipt.transactionHash);
    
 
  } catch (error) {
    console.error("Error investing:", error);
    alert("Failed to invest. See console for details.");
  }
};

const NFTMarketplace: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPropertyPopup, setShowPropertyPopup] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<NFT | null>(null);

  useEffect(() => {
    const fetchNFTsWithDetails = async () => {
      try {
        console.log("Fetching NFTs...");
        const marketplaceRef = collection(firestore, 'marketplace');
        const snapshot = await getDocs(marketplaceRef);
        console.log("Snapshot size:", snapshot.size);
        
        if (snapshot.empty) {
          console.log("No documents found in the marketplace collection");
          setError("No listings available at the moment.");
          return;
        }

        const fetchedNFTs: NFT[] = await Promise.all(snapshot.docs.map(async (document) => {
          const data = document.data();
          console.log("Marketplace document data:", data);
          
          const loanAmount = typeof data.loanAmount === 'number' ? data.loanAmount : 0;
          
          // Fetch property details from users collection
          let propertyDetails: PropertyDetails = {
            propertyName: '',
            location: '',
            price: '',
            images: [],
            bedrooms: '',
            bathrooms: '',
            space: ''
          };
          try {
            const userPropertyRef = doc(firestore, 'users', data.borrowerId, 'properties', data.propertyId);
            const propertyDoc = await getDoc(userPropertyRef);
            if (propertyDoc.exists()) {
              const propertyData = propertyDoc.data() as DocumentData;
              propertyDetails = {
                propertyName: propertyData.propertyName || '',
                location: propertyData.location || '',
                price: propertyData.price || '',
                images: propertyData.images || [],
                bedrooms: propertyData.bedrooms || '',
                bathrooms: propertyData.bathrooms || '',
                space: propertyData.space || ''
              };
              console.log("Property details:", propertyDetails);
            } else {
              console.log("No property details found for:", data.propertyId);
            }
          } catch (error) {
            console.error("Error fetching property details:", error);
          }

          return {
            id: document.id,
            metadata: {
              name: propertyDetails.propertyName || `Property ${data.propertyId || 'Unknown'}`,
              description: `${propertyDetails.bedrooms || ''} bed, ${propertyDetails.bathrooms || ''} bath, ${propertyDetails.space || ''} sqft`,
              image: propertyDetails.images && propertyDetails.images.length > 0 ? propertyDetails.images[0] : '/api/placeholder/200/200',
            },
            priceEth: loanAmount.toString(),
            datePosted: data.createdAt?.toDate().toISOString().split('T')[0] || 'Unknown Date',
            borrowerAddress: data.borrowerAddress || 'Unknown',
            borrowerId: data.borrowerId || 'Unknown',            
            interestRate: data.interestRate || 'Unknown',
            landPrice: typeof data.landPrice === 'number' ? data.landPrice : 0,
            loanAmount: loanAmount,
            loanPeriod: data.loanPeriod || 'Unknown',
            propertyId: data.propertyId || 'Unknown',
            status: data.status || 'Unknown',
            tokenId: data.tokenId || 'Unknown',
            propertyDetails: propertyDetails,
          };
        }));

        console.log("Fetched NFTs with details:", fetchedNFTs);
        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setError("Failed to fetch listings. Please try again later.");
      }
    };

    fetchNFTsWithDetails();
  }, []);



  const handleSearch = (): void => {
    alert(`Searching for:
    Name: ${name}
    Location: ${location}
    Price Ranges: ${selectedPriceRanges.map(range => range.label).join(', ')}`);
  };

  const handleClosePopup = () => {
    setShowPropertyPopup(false);
    setSelectedProperty(null);
  };


  const handleView = (nft: NFT): void => {
    setSelectedProperty(nft);
    setShowPropertyPopup(true);
  };
  const handleInvest = async (nft: NFT) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateOfLienABI, signer);

      // Get the latest lien details
      const lienDetails = await contract.getLienDetails(nft.tokenId);
      
      if (lienDetails.lender !== ethers.ZeroAddress) {
        throw new Error("This loan has already been funded");
      }

      // Convert loanAmount to wei
      const loanAmountWei = ethers.parseEther(nft.loanAmount.toString());

      // Send the transaction
      const tx = await contract.invest(nft.tokenId, { value: loanAmountWei });
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      console.log("Investment successful", receipt);
      alert("Investment successful! Transaction hash: " + receipt.transactionHash);
      
      // You might want to update the UI or refetch the NFTs here
    } catch (error) {
      console.error("Error investing:", error);
      alert("Failed to invest. See console for details.");
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-4xl font-bold mb-4">
    <span className="text-[#b7e3cc]">Venture</span>{" "}
    <span className="text-white">Vineyard</span>
   
  </h1>

      <div className="mb-4">
      <h2 className="text-2xl font-light text-white mb-4 leading-relaxed">
    Piece together a vibrant tapestry{" "}
    <span className="text-[#b7e3cc]">of projects</span>, where every investment{" "}
    <span className="text-[#b7e3cc]">adds color</span> to the big picture
  </h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 flex-grow text-black"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            className="border p-2 flex-grow text-black"
          />
          
          <PriceRangeCheckboxes 
          onChange={setSelectedPriceRanges} 
          />
           <button
            onClick={handleSearch}
            className="bg-[#533c47] text-white w-10 h-10 rounded hover:bg-[#b7e3cc] transition-colors duration-300 ease-in-out flex items-center justify-center flex-shrink-0"
          >
            <FaSearch size={16} />
          </button>
        </div>
      </div>
      

      <div className="grid grid-cols-3 gap-4 mb-8">
        {nfts.map((nft) => (
          <div key={nft.id} className="border p-4 rounded shadow-lg">
            <img src={nft.metadata.image} alt={nft.metadata.name} className="mb-2 w-full h-48 object-cover" />
            <h2 className="font-bold">{nft.metadata.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{nft.metadata.description}</p>
            <p className="text-sm"><strong>Location:</strong> {nft.propertyDetails.location}</p>
            <p className="text-sm"><strong>Property Value:</strong> ${nft.propertyDetails.price}</p>
            <p className="text-sm"><strong>Loan Amount:</strong> {nft.loanAmount} ETH</p>
            <p className="text-sm"><strong>Interest Rate:</strong> {nft.interestRate}</p>
            <p className="text-sm"><strong>Loan Period:</strong> {nft.loanPeriod}</p>
            <p className="text-sm"><strong>Posted:</strong> {nft.datePosted}</p>
            <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => handleView(nft)}
              className="mt-2 bg-[#533c47] text-white px-4 py-2 rounded w-full hover:bg-[#b7e3cc] transition-colors duration-300 ease-in-out"
            >
              View
            </button>
            <button 
              onClick={() => handleInvest(nft)}
              className="mt-2 bg-[#533c47] text-white px-4 py-2 rounded w-full hover:bg-[#b7e3cc] transition-colors duration-300 ease-in-out"
            >
              Invest
            </button>
            </div>
          </div>
        ))}
      </div>

      {showPropertyPopup && selectedProperty && (
        <PropertyFocusPopup
          property={{
            ...selectedProperty.propertyDetails,
            idc: selectedProperty.propertyId,
            userId: selectedProperty.borrowerId,
            daoenabled: true, // Assuming all properties in the marketplace are DAO-enabled
            additionalComments: selectedProperty.metadata.description,
            // Add any other properties that PropertyFocusPopup expects
          }}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default NFTMarketplace;
*/

const LendDetails = () => {
  return (
    <div>
      <h1>Lend Details</h1>
    </div>
  );
};

export default LendDetails;
// src/components/NFTMarketplace.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface NFT {
  id: string;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}

const NFTMarketplace: React.FC = () => {

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [minting, setMinting] = useState(false);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        
      >
        Connect Wallet
      </button>

      <div className="grid grid-cols-3 gap-4 mb-8">
        
      </div>

      <h2 className="text-2xl font-semibold mb-4">Mint New NFT</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
     
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  );
};

export default NFTMarketplace;

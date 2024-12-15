import React from 'react';

const NftsOwned: React.FC = () => {
  const nfts = [
    { name: 'Roma Avenue', value: '0.91 Ether', change: '+10%' },
    { name: 'Thorian Park', value: '0.89 Ether', change: '-19%' },
    { name: 'Linda Mansion', value: '1.1 Ether', change: '-17%' },
    { name: 'Villa Mary', value: '0.71 Ether', change: '+22%' },
  ];

  return (
    <div className="nfts-owned">
      <h3>NFTs Owned</h3>
      <ul>
        {nfts.map((nft, index) => (
          <li key={index}>
            <span>{nft.name}</span>
            <strong>{nft.value}</strong>
            <span>{nft.change}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NftsOwned;

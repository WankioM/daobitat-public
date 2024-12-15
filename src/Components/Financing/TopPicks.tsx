import React from 'react';

const TopPicks: React.FC = () => {
  const picks = [
    { name: 'Roma Avenue', price: '$400,000', etherValue: '0.000345 Ether' },
    { name: 'Atlas Shack', price: '$500,000', etherValue: '0.000678 Ether' },
    // Add other items here
  ];

  return (
    <div className="top-picks">
      <h3>Top Picks</h3>
      <ul>
        {picks.map((pick, index) => (
          <li key={index}>
            <span>{pick.name}</span>
            <strong>{pick.price}</strong>
            <span>{pick.etherValue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopPicks;

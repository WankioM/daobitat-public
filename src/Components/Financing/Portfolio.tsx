import React from 'react';

const Portfolio: React.FC = () => {
  const properties = [
    { name: 'Mandragora Mansion', value: '0.005 Ether' },
    { name: 'Halbert Avenue', value: '0.076 Ether' },
  ];

  return (
    <div className="portfolio">
      <h3>My Portfolio</h3>
      <ul>
        {properties.map((property, index) => (
          <li key={index}>
            <span>{property.name}</span>
            <strong>{property.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;

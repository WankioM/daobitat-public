import React from 'react';

interface PageInConstructionProps {
  onClose: () => void;
}

const PageInConstruction: React.FC<PageInConstructionProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Page Under Construction</h2>
        <p>We apologize, but this feature or component is currently unavailable. Our team is working diligently to resolve this and improve your experience.</p>
        <p>Please try again later or contact support if the issue persists.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PageInConstruction;
import React from 'react';

interface LoadingProps {
  message?: string;
  isOpen: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading', isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-graphite bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-milk rounded-lg p-8 shadow-xl flex flex-col items-center">
        <div className="loader mb-4">
          <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            x="0px" 
            y="0px"
            width="40px" 
            height="50px" 
            viewBox="0 0 24 30" 
            style={{ enableBackground: "new 0 0 50 50" } as React.CSSProperties} 
            xmlSpace="preserve"
          >
            <rect x="0" y="10" width="4" height="10" fill="#d43545" opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="8" y="10" width="4" height="10" fill="#4A4947" opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
            </rect>
            <rect x="16" y="10" width="4" height="10" fill="#d43545" opacity="0.2">
              <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
        <p className="font-helvetica-regular text-graphite text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
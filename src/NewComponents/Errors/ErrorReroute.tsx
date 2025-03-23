import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorRerouteProps {
  errorMessage: string;
  redirectRoute: string;
  redirectState?: any;
  timeout?: number;
}

const ErrorReroute: React.FC<ErrorRerouteProps> = ({
  errorMessage,
  redirectRoute,
  redirectState,
  timeout = 3000 // Default 3 seconds
}) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(Math.floor(timeout / 1000));

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(redirectRoute, { state: redirectState });
    }, timeout);

    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate, redirectRoute, redirectState, timeout]);

  return (
    <div className="fixed inset-0 bg-graphite/60 z-50 flex items-center justify-center">
      <div className="bg-milk p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-4 text-rustyred">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-graphite mb-4">{errorMessage}</h3>
        
        <div className="mb-6 flex justify-center">
          <div className="spinner h-8 w-8 border-4 border-rustyred/30 border-t-rustyred rounded-full animate-spin"></div>
        </div>
        
        <p className="text-sm text-graphite/70">
          Redirecting in {timeLeft} {timeLeft === 1 ? 'second' : 'seconds'}...
        </p>
      </div>
    </div>
  );
};

export default ErrorReroute;
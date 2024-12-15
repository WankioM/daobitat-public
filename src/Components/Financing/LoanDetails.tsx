import React, { useState, useCallback, useEffect } from 'react';
import { CSSProperties } from 'react';
import { useUser } from '../../contexts/UserContext';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';
import PropertyFormContainer from '../Dashboards/AddProperty/PropertyFormContainer';
import '../../Components/Dashboards/AddProperty/Properties.css';

const customStyles: CSSProperties = {
  ['--select-button-svg' as string]: "url('data:image/svg+xml...')",
  fontFamily: '"Public Sans", "Noto Sans", sans-serif',
};

const currencies = [
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'BNB', name: 'Binance Coin' },
  { code: 'XRP', name: 'Ripple' },
  { code: 'ADA', name: 'Cardano' },
  { code: 'USDT', name: 'Tether' },
  { code: 'USDC', name: 'USD Coin' },
  { code: 'BUSD', name: 'Binance USD' },
  { code: 'DAI', name: 'Dai' },
  { code: 'TUSD', name: 'TrueUSD' },
];

const LoanDetails: React.FC = () => {
  const { user } = useUser();
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('');
  const [loanCurrency, setLoanCurrency] = useState('KES');
  const [collateralDocument, setCollateralDocument] = useState<File | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      const userUid = user.uid;
      const propertiesRef = collection(firestore, 'users', userUid, 'properties');
      const propertiesSnapshot = await getDocs(propertiesRef);
      const propertiesList = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propertiesList);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const getPropertyDisplayName = (property: any) => {
    const parts = [];
    if (property.name) parts.push(property.name);
    if (property.location) parts.push(property.location);
    if (property.unitNo) parts.push(`Unit ${property.unitNo}`);
    return parts.join(' - ') || 'Unnamed Property';
  };

  const handlePropertyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedProperty(value);
    if (value === 'add_new') {
      setShowForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    fetchProperties();
    setSelectedProperty('');
  };

  const convertToEth = async (amount: string, fromCurrency: string): Promise<string> => {
    if (fromCurrency === 'ETH') return amount;
    
    try {
      console.log('Starting conversion to ETH:', { amount, fromCurrency });
      const apiKey = process.env.REACT_APP_EXCHANGERATE_API_KEY;
      if (!apiKey) {
        throw new Error('ExchangeRate API key is not defined');
      }

      const directUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
      console.log('Attempting direct API call:', directUrl);
      
      let response;
      try {
        response = await fetch(directUrl);
      } catch (error) {
        console.log('Direct API call failed, trying CORS proxy');
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const proxyUrl = `${corsProxy}${directUrl}`;
        response = await fetch(proxyUrl);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Conversion data:', data);
      if (data.result !== 'success') {
        throw new Error(`API Error: ${data['error-type']}`);
      }

      const usdRate = data.conversion_rates.USD;
      console.log('USD Rate:', usdRate);
      if (typeof usdRate !== 'number' || isNaN(usdRate)) {
        throw new Error('Invalid USD conversion rate');
      }

      const amountInUsd = parseFloat(amount) * usdRate;
      console.log('Amount in USD:', amountInUsd);

      // Hardcoded ETH rate as fallback (1 ETH = $2000 USD)
      const ethRate = 1 / 2000;
      console.log('Using fallback ETH Rate:', ethRate);

      const ethAmount = amountInUsd * ethRate;
      console.log('Final ETH Amount:', ethAmount);

      if (isNaN(ethAmount)) {
        throw new Error('Conversion resulted in NaN');
      }

      return ethAmount.toFixed(18); // 18 decimal places for ETH
    } catch (error) {
      console.error('Error in convertToEth:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      const ethAmount = await convertToEth(loanAmount, loanCurrency);
      const userUid = user.uid;
      const loanRequestRef = collection(firestore, 'financing', 'Requested loans', userUid);
      await addDoc(loanRequestRef, {
        propertyId: selectedProperty,
        loanAmount: ethAmount,
        loanCurrency: 'ETH',
        originalAmount: loanAmount,
        originalCurrency: loanCurrency,
        interestRate,
        repaymentPeriod,
        timestamp: new Date(),
        status: 'pending'
      });
      alert('Loan request submitted successfully!');
      // Reset form after successful submission
      setSelectedProperty('');
      setLoanAmount('');
      setLoanCurrency('KES');
      setInterestRate('');
      setRepaymentPeriod('');
      setCollateralDocument(null);
    } catch (error) {
      console.error('Error submitting loan request:', error);
      alert('Failed to submit loan request. Please try again.');
    }
  };

  return (
    <div className="layout-container flex h-full grow flex-col p-8">
      <h2 className="text-[#b7e3cc] text-[42px] font-bold leading-tight tracking-[-0.015em] w-full text-center">
        Discover the depth of your Assets in a Global world
      </h2>
      <h2 className="text-white text-[28px] font-thin leading-tight tracking-[-0.015em] w-full text-center">
        Get started by letting us know more about your requirements
      </h2>

      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
          {/* Loan amount input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                type="number"
                placeholder="Loan amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#533c47] bg-[#261c21] focus:border-[#533c47] h-14 placeholder:text-[#b89dab] p-[15px] text-base font-normal leading-normal"
              />
            </label>
            <select
              value={loanCurrency}
              onChange={(e) => setLoanCurrency(e.target.value)}
              className="form-select w-24 rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#533c47] bg-[#261c21] focus:border-[#533c47] h-14 placeholder:text-[#b89dab] p-[15px] text-base font-normal leading-normal"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
          
          {/* Interest rate input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="Interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#533c47] bg-[#261c21] focus:border-[#533c47] h-14 placeholder:text-[#b89dab] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>
          
          {/* Repayment period input */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                placeholder="Repayment period in months"
                value={repaymentPeriod}
                onChange={(e) => setRepaymentPeriod(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#533c47] bg-[#261c21] focus:border-[#533c47] h-14 placeholder:text-[#b89dab] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
    <label className="flex flex-col min-w-40 flex-1">
      <span className="mb-2 text-white text-sm">Attach valuation report (not older than 2yrs)</span>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setCollateralDocument(e.target.files[0]);
          }
        }}
        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#533c47] bg-[#261c21] focus:border-[#533c47] h-14 placeholder:text-[#b89dab] p-[15px] text-base font-normal leading-normal"
      />
    </label>
  </div>

          {/* Collateral value dropdown */}
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <select
                value={selectedProperty}
                onChange={handlePropertyChange}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#533c47] bg-[#261c21] focus:border-[#533c47] h-14 bg-[image:var(--select-button-svg)] placeholder:text-[#b89dab] p-[15px] text-base font-normal leading-normal"
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {getPropertyDisplayName(property)}
                  </option>
                ))}
                <option value="add_new" className="text-celadon">Property not on list</option>
              </select>
            </label>
          </div>

          {/* Submit button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleSubmit}
              className="bg-[#533c47] text-white rounded-xl px-6 py-3 font-medium text-base hover:bg-[#3b2934] focus:outline-none focus:ring-2 focus:ring-[#b89dab]"
            >
              Submit
            </button>
          </div>
        </div>

        {showForm && (
          <div className="overlay">
            <div className="overlay-content">
              <button className="close-button" onClick={handleCloseForm}>
                &times;
              </button>
              <PropertyFormContainer handleCloseForm={handleCloseForm} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;

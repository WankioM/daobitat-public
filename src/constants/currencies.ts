// src/constants/currencies.ts

export interface Currency {
    code: string;
    name: string;
    type: 'fiat' | 'crypto' | 'stablecoin';
    symbol?: string;
    network?: string;
  }
  
  export const currencies: Currency[] = [
    // African Currencies
    { code: 'KES', name: 'Kenyan Shilling', type: 'fiat', symbol: 'KSh' },
    { code: 'TZS', name: 'Tanzanian Shilling', type: 'fiat', symbol: 'TSh' },
    { code: 'UGX', name: 'Ugandan Shilling', type: 'fiat', symbol: 'USh' },
  
    // Major Fiat Currencies
    { code: 'USD', name: 'US Dollar', type: 'fiat', symbol: '$' },
    { code: 'EUR', name: 'Euro', type: 'fiat', symbol: '€' },
    { code: 'GBP', name: 'British Pound', type: 'fiat', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', type: 'fiat', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', type: 'fiat', symbol: 'Fr' },
    { code: 'CAD', name: 'Canadian Dollar', type: 'fiat', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', type: 'fiat', symbol: 'A$' },
    { code: 'CNY', name: 'Chinese Yuan', type: 'fiat', symbol: '¥' },
  
    // Major Cryptocurrencies
    { code: 'BTC', name: 'Bitcoin', type: 'crypto', symbol: '₿', network: 'Bitcoin' },
    { code: 'ETH', name: 'Ethereum', type: 'crypto', symbol: 'Ξ', network: 'Ethereum' },
    { code: 'BNB', name: 'Binance Coin', type: 'crypto', network: 'BNB Chain' },
    { code: 'XRP', name: 'Ripple', type: 'crypto', network: 'Ripple' },
    { code: 'ADA', name: 'Cardano', type: 'crypto', network: 'Cardano' },
    { code: 'XLM', name: 'Stellar Lumens', type: 'crypto', network: 'Stellar' },
    { code: 'STRK', name: 'Starknet Token', type: 'crypto', network: 'Starknet' },
  
    // Stablecoins
    { code: 'USDT', name: 'Tether', type: 'stablecoin', symbol: '$', network: 'Multiple' },
    { code: 'USDC', name: 'USD Coin', type: 'stablecoin', symbol: '$', network: 'Multiple' },
    { code: 'BUSD', name: 'Binance USD', type: 'stablecoin', symbol: '$', network: 'Multiple' },
    { code: 'DAI', name: 'Dai', type: 'stablecoin', symbol: '$', network: 'Ethereum' },
    { code: 'TUSD', name: 'TrueUSD', type: 'stablecoin', symbol: '$', network: 'Multiple' }
  ];
  
  // Helper function to get currency symbol
  export const getCurrencySymbol = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency?.symbol || code;
  };
  
  // Helper function to get currency by code
  export const getCurrencyByCode = (code: string): Currency | undefined => {
    return currencies.find(c => c.code === code);
  };
  
  // Helper function to get currencies by type
  export const getCurrenciesByType = (type: Currency['type']): Currency[] => {
    return currencies.filter(c => c.type === type);
  };
  
  // Group currencies by type
  export const currencyGroups = {
    fiat: getCurrenciesByType('fiat'),
    crypto: getCurrenciesByType('crypto'),
    stablecoin: getCurrenciesByType('stablecoin')
  };
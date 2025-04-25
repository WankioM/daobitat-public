// types/starknet.ts
import type { StarknetWindowObject } from 'get-starknet-core';

/**
 * Augment the Window interface to include Starknet wallet providers
 */
declare global {
  interface Window {
    starknet?: StarknetWindowObject;
    starknet_braavos?: StarknetWindowObject;
    starknet_argentX?: StarknetWindowObject;
  }
}

/**
 * Helper to safely check and get Starknet providers
 */
export const getStarknetProvider = (
  providerType: 'starknet' | 'starknet_braavos' | 'starknet_argentX'
): StarknetWindowObject | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window[providerType];
};

/**
 * Check if any Starknet wallet is available
 */
export const isStarknetAvailable = (): boolean => {
  return !!(
    window.starknet || 
    window.starknet_braavos || 
    window.starknet_argentX
  );
};

/**
 * Enable a Starknet wallet and return its address
 * @param providerType The type of Starknet provider to use
 * @returns The wallet address if successful
 */
export const enableStarknetWallet = async (
  providerType: 'starknet' | 'starknet_braavos' | 'starknet_argentX' = 'starknet'
): Promise<string> => {
  const provider = getStarknetProvider(providerType);
  
  if (!provider) {
    throw new Error(`${providerType} wallet provider not detected`);
  }
  
  await provider.enable();
  
  if (!provider.selectedAddress) {
    throw new Error(`No address selected in ${providerType} wallet`);
  }
  
  return provider.selectedAddress;
};
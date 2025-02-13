// types/payment.ts

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  selectedAddress?: string;
  isMetaMask?: boolean;
  isConnected: () => boolean;
}

import type { StarknetWindowObject } from 'get-starknet-core';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    starknet?: StarknetWindowObject;
    starknet_braavos?: StarknetWindowObject;
    starknet_argentX?: StarknetWindowObject;
    braavos?: StarknetWindowObject;
    argent?: StarknetWindowObject;
  }
}

export type { EthereumProvider };
// src/NewComponents/PaymentFlow/PaymentMethods/Wallets/configs/index.ts
import { WalletConfig, WalletType } from '../walletTypes';
import { BraavosConfig } from './BraavosConfig';
import { MetaMaskConfig } from './MetaMaskConfig';
import { ArgentConfig } from './ArgentConfig';

export const walletConfigs: WalletConfig[] = [
  MetaMaskConfig,
  BraavosConfig,
  ArgentConfig
  // Add other wallet configs here as needed
];

export const getWalletConfig = (type: WalletType): WalletConfig | undefined => {
  return walletConfigs.find(config => config.type === type);
};
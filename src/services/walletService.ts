// src/services/walletService.ts
type EthereumProvider = {
  request: (args: { method: string; params?: any[] }) => Promise<string[]>;
}

type StarknetProvider = {
  enable: () => Promise<void>;
  selectedAddress: string;
}

type ExtendedWindow = Window & {
  ethereum?: EthereumProvider;
  starknet?: StarknetProvider;
}

declare const window: ExtendedWindow;

export interface WalletProvider {
  id: string;
  name: string;
  connect: () => Promise<string>;
  isInstalled: () => boolean;
}

class WalletService {
  private walletProviders: Record<string, WalletProvider> = {
    metamask: {
      id: 'metamask',
      name: 'MetaMask',
      isInstalled: () => typeof window.ethereum !== 'undefined',
      connect: async () => {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask to continue');
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts[0]) {
          throw new Error('No accounts found');
        }
        return accounts[0];
      }
    },
    rainbow: {
      id: 'rainbow',
      name: 'Rainbow',
      isInstalled: () => typeof window.ethereum !== 'undefined',
      connect: async () => {
        if (!window.ethereum) {
          throw new Error('Please install Rainbow Wallet to continue');
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts[0]) {
          throw new Error('No accounts found');
        }
        return accounts[0];
      }
    },
    braavos: {
      id: 'braavos',
      name: 'Braavos',
      isInstalled: () => typeof window.starknet !== 'undefined',
      connect: async () => {
        if (!window.starknet) {
          throw new Error('Please install Braavos wallet to continue');
        }
        await window.starknet.enable();
        if (!window.starknet.selectedAddress) {
          throw new Error('No account selected');
        }
        return window.starknet.selectedAddress;
      }
    },
    argent: {
      id: 'argent',
      name: 'Argent',
      isInstalled: () => typeof window.starknet !== 'undefined',
      connect: async () => {
        if (!window.starknet) {
          throw new Error('Please install Argent X wallet to continue');
        }
        await window.starknet.enable();
        if (!window.starknet.selectedAddress) {
          throw new Error('No account selected');
        }
        return window.starknet.selectedAddress;
      }
    }
  };

  async connectWallet(walletId: string): Promise<string> {
    const provider = this.walletProviders[walletId];
    
    if (!provider) {
      throw new Error('Unsupported wallet');
    }

    if (!provider.isInstalled()) {
      throw new Error(`Please install ${provider.name} to continue`);
    }

    return provider.connect();
  }
}

export const walletService = new WalletService();

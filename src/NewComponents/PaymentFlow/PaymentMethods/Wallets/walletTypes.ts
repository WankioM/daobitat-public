export type WalletType = 'metamask' | 'braavos' | 'argent';

export interface WalletConfig {
  type: WalletType;
  name: string;
  icon: string;
  description: string;
  isInstalled: () => boolean;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
}
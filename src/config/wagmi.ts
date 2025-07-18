import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';

// Определяем кастомную сеть Somnia Testnet
const somniaTestnet: Chain = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://testnet-explorer.somnia.network',
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'Smash or Steal',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'b91b95236c2a89ed3a99b589d2666f90',
  chains: [somniaTestnet],
  ssr: false,
});

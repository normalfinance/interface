'use client';

import { CONFIG } from '@/global-config';
import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={CONFIG.privy.appId}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        solanaClusters: [
          { name: 'devnet', rpcUrl: '' },
          { name: 'mainnet-beta', rpcUrl: 'https://api.mainnet-beta.solana.com' },
        ],
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

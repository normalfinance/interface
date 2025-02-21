'use client';

import useAppStore from '@/stores/app/useAppStore';

import { WalletContext, WalletProvider } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Env, { MARKETS_LOOKUP } from '@/constants/environment';
// import { useSyncVaultClient } from '@/hooks/useSyncVaultClient';
import { UIMarket } from '@/types';
import { initializeNormalStore, useCommonNormalStore } from '@/stores';
import {
  MarketAndAccount,
  useHandleBadRpc,
  useSyncOraclePriceStore,
  useSyncWalletToStore,
} from '@/hooks';
import { NormalProvider } from '@/providers';

initializeNormalStore(Env);

// Initialize QueryClient outside component to prevent recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

const marketsAndAccounts: MarketAndAccount[] = [];
MARKETS_LOOKUP.forEach((market) => {
  marketsAndAccounts.push({
    market: UIMarket.createSynthMarket(market.marketIndex),
    accountToUse: market.oracle,
  });
});

const AppSetup = ({ children }: { children: React.ReactNode }) => {
  useSyncWalletToStore();
  useSyncOraclePriceStore(marketsAndAccounts);
  //   useSyncVaultClient();
  useHandleBadRpc();

  return <>{children}</>;
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const get = useAppStore((s) => s.get);
  const getCommon = useCommonNormalStore((s) => s.get);

  useEffect(() => {
    // easy access the app & common store from the window object in the console
    // @ts-ignore
    window.normal_dev = { getStore: get, getCommonStore: getCommon };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider wallets={[]} autoConnect>
        <NormalProvider
          // @ts-ignore
          walletContext={WalletContext}
          disable={{}}
          additionalNormalClientConfig={{
            opts: {
              skipPreflight: true,
            },
          }}
          //   breakpoints={DEFAULT_BREAKPOINTS}
        >
          <AppSetup>{children}</AppSetup>
        </NormalProvider>
      </WalletProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppWrapper;

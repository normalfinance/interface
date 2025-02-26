import { PublicKey } from '@solana/web3.js';
import { useSubscribedMarket } from './useSubscribedMarket';
// import { useSubscribedMarketDepositor } from './useSubscribedMarketDepositor';
import { getSingleMarketStats } from './useSyncMarketsStats';
import { useCallback, useEffect } from 'react';
import useAppStore from '@/stores/app/useAppStore';
import { MarketType } from '@normalfinance/solana-sdk';
import { getUiMarketConfig } from '@/lib/utils';
import { useCommonNormalStore, useOraclePriceStore } from '@/stores';
import { useNormalClientIsReady } from '@/hooks';
import { MarketId } from '@/types';

export const useMarket = (marketPubkey: string) => {
  const uiMarketConfig = getUiMarketConfig(marketPubkey);

  const normalClient = useCommonNormalStore((s) => s.normalClient.client);
  const normalClientIsReady = useNormalClientIsReady();
  const setAppStore = useAppStore((s) => s.set);
  const getOraclePriceForMarket = useOraclePriceStore((s) => s.getMarketPriceData);

  const oraclePriceData = getOraclePriceForMarket(
    new MarketId(uiMarketConfig?.market.marketIndex ?? 0, MarketType.SYNTH)
  );
  const memoizedOraclePriceGetter = useCallback(
    (_marketId: MarketId) => oraclePriceData,
    [oraclePriceData?.priceData.price]
  );

  // const apyReturnsLookup = useMarketsApyReturnsLookup();
  const { marketAccountData, marketAccount } = useSubscribedMarket(marketPubkey);
  // const { marketDepositorAccountData, isLoaded: isMarketDepositorLoaded } =
  //   useSubscribedMarketDepositor(marketPubkey);

  const syncMarketStats = useCallback(async () => {
    if (marketPubkey && normalClientIsReady && normalClient) { // && apyReturnsLookup[marketPubkey]
      const marketStats = await getSingleMarketStats(
        normalClient,
        new PublicKey(marketPubkey),
        // apyReturnsLookup[marketPubkey],
        memoizedOraclePriceGetter
      );
      setAppStore((s) => {
        s.marketsStats[marketPubkey] = marketStats;
      });
    }
  }, [
    marketPubkey,
    // apyReturnsLookup[marketPubkey],
    memoizedOraclePriceGetter,
    normalClientIsReady,
    normalClient,
  ]);

  useEffect(() => {
    syncMarketStats();
  }, [syncMarketStats]);

  return {
    marketAccountData,
    marketAccount,
    // marketDepositorAccountData,
    // isMarketDepositorLoaded,
    syncMarketStats,
  };
};

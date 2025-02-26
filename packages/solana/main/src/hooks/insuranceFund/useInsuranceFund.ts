import { PublicKey } from '@solana/web3.js';
import { useSubscribedVault } from './useSubscribedVault';
import { useSubscribedVaultDepositor } from './useSubscribedVaultDepositor';
import { getSingleVaultStats, useVaultsApyReturnsLookup } from './useSyncVaultsStats';
import { useCallback, useEffect } from 'react';
import useAppStore from '@/stores/app/useAppStore';
import { MarketType } from '@normal-labs/sdk';
import { getUiVaultConfig } from '@/lib/utils';
import { useCommonNormalStore, useOraclePriceStore } from '@/stores';
import { useNormalClientIsReady } from '@/hooks';
import { MarketId } from '@/types';

export const useInsuranceFund = (vaultPubkey: string) => {
  const uiVaultConfig = getUiVaultConfig(vaultPubkey);

  const normalClient = useCommonNormalStore((s) => s.normalClient.client);
  const normalClientIsReady = useNormalClientIsReady();
  const setAppStore = useAppStore((s) => s.set);
  const getOraclePriceForMarket = useOraclePriceStore((s) => s.getMarketPriceData);

  const oraclePriceData = getOraclePriceForMarket(
    new MarketId(uiVaultConfig?.market.marketIndex ?? 0, MarketType.SPOT)
  );
  const memoizedOraclePriceGetter = useCallback(
    (_marketId: MarketId) => oraclePriceData,
    [oraclePriceData?.priceData.price]
  );

  const apyReturnsLookup = useVaultsApyReturnsLookup();
  const { vaultAccountData, vaultAccount } = useSubscribedVault(vaultPubkey);
  const { vaultDepositorAccountData, isLoaded: isVaultDepositorLoaded } =
    useSubscribedVaultDepositor(vaultPubkey);

  const syncVaultStats = useCallback(async () => {
    if (vaultPubkey && normalClientIsReady && normalClient && apyReturnsLookup[vaultPubkey]) {
      const vaultStats = await getSingleVaultStats(
        normalClient,
        new PublicKey(vaultPubkey),
        apyReturnsLookup[vaultPubkey],
        memoizedOraclePriceGetter
      );
      setAppStore((s) => {
        s.vaultsStats[vaultPubkey] = vaultStats;
      });
    }
  }, [
    vaultPubkey,
    apyReturnsLookup[vaultPubkey],
    memoizedOraclePriceGetter,
    normalClientIsReady,
    normalClient,
  ]);

  useEffect(() => {
    syncVaultStats();
  }, [syncVaultStats]);

  return {
    vaultAccountData,
    vaultAccount,
    vaultDepositorAccountData,
    isVaultDepositorLoaded,
    syncVaultStats,
  };
};

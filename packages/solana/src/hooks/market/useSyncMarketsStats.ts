'use client';

// import { Vault, VAULT_SHARES_PRECISION_EXP, VaultClient } from '@normal-labs/vaults-sdk';
import {
  BigNum,
  BN,
  NormalClient,
  getUserStatsAccountPublicKey,
  PRICE_PRECISION_EXP,
  PublicKey,
  QUOTE_PRECISION_EXP,
  MarketConfig,
  UserAccount,
  UserStatsAccount,
  ZERO,
  MarketAccount,
} from '@normalfinance/solana-sdk';
// import { ApyReturnsLookup, MarketStats } from '@/types/vaults';
import { useEffect, useMemo, useState } from 'react';
// import { DEFAULT_OFF_CHAIN_STATS, DEFAULT_PERIOD_APY } from '@/constants/misc';
import { Connection } from '@solana/web3.js';
// import { getVaultsApyReturns } from '@/server-actions/vaults';
// import { getUiVaultConfig } from '@/lib/utils';
// import {
//   OraclePriceInfo,
//   useCommonNormalStore,
//   useNormalClientIsReady,
//   useOraclePriceStore,
// } from '@normal-labs/react';
// import { VAULTS } from '@/constants/vaults';
import useAppStore, { AppStoreState } from '@/stores/app/useAppStore';
import { MarketStats } from '@/types/markets';
import { MarketId, UIMarket } from '@/types';
import { OraclePriceInfo, useCommonNormalStore, useOraclePriceStore } from '@/stores';
import { useNormalClientIsReady } from '..';

const fetchUserStats = async (normalClient: NormalClient, marketPubkey: PublicKey) => {
  const userStatsPubkey = getUserStatsAccountPublicKey(
    normalClient.program.programId,
    marketPubkey
  );
  const userStats = await normalClient.program.account.userStats.fetch(userStatsPubkey);

  return userStats as UserStatsAccount;
};

const fetchNormalUserAccount = async (
  normalClient: NormalClient,
  marketNormalUserPubkey: PublicKey
) => {
  const normalUserAccount = await normalClient.program.account.user.fetch(marketNormalUserPubkey);

  return normalUserAccount as UserAccount;
};

const fetchNormalMarketAccount = async (normalClient: NormalClient, marketPubkey: PublicKey) => {
  const normalMarketAccount = await normalClient.program.account.market.fetch(marketPubkey);

  return normalMarketAccount as MarketAccount;
};

export type MarketsOnChainDataLookup = Record<
  string,
  {
    marketAccountData: MarketAccount;
    userStatsData: UserStatsAccount;
    vaultQuoteTvl: BN;
    vaultNormalUser: UserAccount;
  }
>;

const marketAccountDataDecoder = (
  buffer: Buffer,
  normalProgram: NormalClient['program']
): MarketAccount => {
  const account = normalProgram.account.user.coder.accounts.decodeUnchecked('Market', buffer);
  return account;
};

const userStatsDataDecoder = (
  buffer: Buffer,
  normalProgram: NormalClient['program']
): UserStatsAccount => {
  const account = normalProgram.account.userStats.coder.accounts.decodeUnchecked(
    'UserStats',
    buffer
  );
  return account;
};

const userAccountDataDecoder = (
  buffer: Buffer,
  normalProgram: NormalClient['program']
): UserAccount => {
  const account = normalProgram.account.user.coder.accounts.decodeUnchecked('User', buffer);
  return account;
};

// this method of processing is used to reduce the number of individual RPC calls needed to
// be made to get a vault's on-chain data, by combining most accounts into one `getMultipleAccountsInfo` RPC call
export const getMultipleOnChainVaultData = async (
  normalClient: NormalClient,
  connection: Connection,
  marketPubkeys: PublicKey[]
): Promise<MarketsOnChainDataLookup> => {
  // create pairs of vault public keys and its user stats account
  const pubKeysToFetch = marketPubkeys
    .map((marketPubkey) => [
      marketPubkey,
      getUserStatsAccountPublicKey(normalClient.program.programId, marketPubkey),
      new PublicKey(getUiVaultConfig(marketPubkey.toString())!.userPubKeyString),
    ])
    .flat();

  const response = await connection.getMultipleAccountsInfo(pubKeysToFetch);

  const marketsOnChainDataLookup: MarketsOnChainDataLookup = {};

  // process each pair of data
  for (let i = 0; i < marketPubkeys.length; i++) {
    const responseIndex = i * 3;
    const marketAccountBuffer = response[responseIndex]!.data;
    const userStatsBuffer = response[responseIndex + 1]!.data;
    const normalUserAccountBuffer = response[responseIndex + 2]!.data;

    const marketAccountData = marketAccountDataDecoder(marketAccountBuffer, normalClient.program);
    const userStatsData = userStatsDataDecoder(userStatsBuffer, normalClient.program);
    const normalUserAccountData: UserAccount = userAccountDataDecoder(
      normalUserAccountBuffer,
      normalClient.program
    );

    const marketPubkeyString = marketPubkeys[i].toString();
    marketsOnChainDataLookup[marketPubkeyString] = {
      marketAccountData,
      userStatsData,
      vaultQuoteTvl: ZERO,
      vaultNormalUser: normalUserAccountData,
    };
  }

  const vaultQuoteTvlPromises = marketPubkeys.map((marketPubkey) => {
    return vaultClient.calculateVaultEquity({
      vault: marketsOnChainDataLookup[marketPubkey.toString()].marketAccountData,
    });
  });
  const vaultsQuoteTvl = await Promise.all(vaultQuoteTvlPromises);

  vaultsQuoteTvl.forEach((vaultQuoteTvl, index) => {
    marketsOnChainDataLookup[marketPubkeys[index].toString()].vaultQuoteTvl = vaultQuoteTvl;
  });

  return marketsOnChainDataLookup;
};

export function constructMarketStats(
  marketPubkey: string,
  marketOnChainData: MarketsOnChainDataLookup[string],
  // apyReturnStat: ApyReturnsLookup[string] | undefined,
  oraclePriceGetter: (marketId: MarketId) => OraclePriceInfo
): MarketStats {
  const uiVaultConfig = getUiVaultConfig(marketPubkey);

  if (!uiVaultConfig) {
    throw new Error('Vault config not found');
  }

  const uiMarket = UIMarket.createSynthMarket(uiVaultConfig.market.marketIndex);
  const marketConfig = uiMarket.market as MarketConfig;
  const oraclePriceBigNum = BigNum.from(
    oraclePriceGetter(uiMarket.marketId)?.rawPriceData.price ?? ZERO,
    PRICE_PRECISION_EXP
  );

  // const offChainStats = apyReturnStat
  //   ? { ...apyReturnStat, hasLoadedOffChainStats: true }
  //   : DEFAULT_OFF_CHAIN_STATS;

  if (oraclePriceBigNum.eqZero()) {
    return {
      hasLoadedOnChainStats: false,
      // totalBasePnl: BigNum.from(ZERO, marketConfig.precisionExp),
      // totalQuotePnl: BigNum.from(ZERO, QUOTE_PRECISION_EXP),
      tvlBase: BigNum.from(ZERO, marketConfig.precisionExp),
      tvlQuote: BigNum.from(ZERO, QUOTE_PRECISION_EXP),
      // capacityPct: 0,
      // volume30Days: BigNum.from(ZERO, QUOTE_PRECISION_EXP),
      // isUncappedCapacity: false,
      // totalShares: BigNum.from(ZERO, VAULT_SHARES_PRECISION_EXP),
      // vaultRedeemPeriodSecs: ZERO,
      notionalGrowthQuotePnl: BigNum.from(ZERO, QUOTE_PRECISION_EXP),
      // profitShare: 0,
      // ...offChainStats,
    };
  }

  const marketAccountData = marketOnChainData.marketAccountData;
  const userStats = marketOnChainData.userStatsData;

  const vaultQuoteTvl = BigNum.from(marketOnChainData.vaultQuoteTvl, QUOTE_PRECISION_EXP);
  const vaultBaseTvl = vaultQuoteTvl.shift(marketConfig.precisionExp).div(oraclePriceBigNum);
  // const totalBasePnl = vaultBaseTvl.sub(
  //   BigNum.from(marketAccountData.netDeposits, marketConfig.precisionExp)
  // );
  // const totalQuotePnl = totalBasePnl.mul(oraclePriceBigNum).shiftTo(QUOTE_PRECISION_EXP);
  // const capacityPct = marketAccountData.maxTokens.eqn(0) // uncapped capacity
  //   ? '0'
  //   : vaultBaseTvl.toPercentage(
  //       BigNum.from(marketAccountData.maxTokens, marketConfig.precisionExp),
  //       marketConfig.precisionExp.toNumber()
  //     );

  // const volume30Days = BigNum.from(
  //   userStats.makerVolume30D.add(userStats.takerVolume30D),
  //   QUOTE_PRECISION_EXP
  // );

  const vaultNormalUserQuoteNetDeposits = BigNum.from(
    marketOnChainData.vaultNormalUser.totalDeposits.sub(
      marketOnChainData.vaultNormalUser.totalWithdraws
    ),
    QUOTE_PRECISION_EXP
  );
  const notionalGrowthQuotePnl = vaultQuoteTvl.sub(vaultNormalUserQuoteNetDeposits);

  return {
    hasLoadedOnChainStats: true,
    // totalBasePnl,
    // totalQuotePnl,
    tvlBase: vaultBaseTvl,
    tvlQuote: vaultQuoteTvl,
    // capacityPct: Math.min(+capacityPct, 100),
    // isUncappedCapacity: marketAccountData.maxTokens.eqn(0),
    // volume30Days,
    // totalShares: BigNum.from(marketAccountData.totalShares, VAULT_SHARES_PRECISION_EXP),
    // vaultRedeemPeriodSecs: marketAccountData.redeemPeriod,
    notionalGrowthQuotePnl,
    // profitShare: marketAccountData.profitShare,
    // ...offChainStats,
  };
}

/**
 * Fetches the on-chain vault stats.
 */
export const getSingleMarketStats = async (
  normalClient: NormalClient,
  marketPubkey: PublicKey,
  // apyReturnStat: ApyReturnsLookup[string],
  oraclePriceGetter: (marketId: MarketId) => OraclePriceInfo
): Promise<MarketStats> => {
  const uiVaultConfig = getUiVaultConfig(marketPubkey.toString());

  if (!uiVaultConfig) {
    throw new Error('Vault config not found');
  }

  const [
    marketAccountData,
    marketQuoteTvlBN,
    userStats,
    marketNormalUserAccount,
  ] = await Promise.all([
    // vaultClient.getVault(marketPubkey),
    fetchNormalMarketAccount(normalClient, marketPubkey),
    // vaultClient.calculateVaultEquity({
    //   address: marketPubkey,
    // }),
    fetchUserStats(normalClient, marketPubkey),
    fetchNormalUserAccount(normalClient, new PublicKey(uiVaultConfig.userPubKeyString)),
  ]);

  const marketStats = constructMarketStats(
    marketPubkey.toString(),
    {
      marketAccountData,
      userStatsData: userStats,
      marketQuoteTvl: marketQuoteTvlBN,
      marketNormalUser: marketNormalUserAccount,
    },
    // apyReturnStat,
    oraclePriceGetter
  );

  return marketStats;
};

// const DEFAULT_VAULTS_STATS: ApyReturnsLookup = {};

// if undefined, use the actual apy value
const APY_CLAMP = {
  min: 0,
  max: undefined,
};

/**
 * Fetches the apy and returns of all vaults.
 */
// export const useVaultsApyReturnsLookup = () => {
//   const [data, setData] = useState<ApyReturnsLookup>(DEFAULT_VAULTS_STATS);

//   useEffect(() => {
//     getVaultsApyReturns().then((res) => {
//       for (const vault of Object.keys(res)) {
//         res[vault].apys[DEFAULT_PERIOD_APY] = Math.min(
//           Math.max(
//             res[vault].apys[DEFAULT_PERIOD_APY],
//             APY_CLAMP.min ?? res[vault].apys[DEFAULT_PERIOD_APY]
//           ),
//           APY_CLAMP.max ?? res[vault].apys[DEFAULT_PERIOD_APY]
//         );
//       }

//       setData(res);
//     });
//   }, []);

//   return data;
// };

/**
 * Syncs the stats for markets that uses the Normal Vault program (a.k.a native vaults).
 */
export const useSyncAllMarketsStats = () => {
  // const offChainVaultsStats = useVaultsApyReturnsLookup();
  // const isLoadingOffChainVaultsStats = Object.keys(offChainVaultsStats).length === 0;
  
  const normalClient = useCommonNormalStore((s) => s.normalClient.client);
  const normalClientIsReady = useNormalClientIsReady();
  const connection = useCommonNormalStore((s) => s.connection);
  const getOraclePriceForMarket = useOraclePriceStore((s) => s.getMarketPriceData);
  const setVaultsStore = useAppStore((s) => s.set);

  const [isMarketStatsLoaded, setIsMarketStatsLoaded] = useState(false);

  const [marketsOnChainDataLookup, setMarketsOnChainDataLookup] =
    useState<MarketsOnChainDataLookup | null>(null);

  const vaultsToFetch = useMemo(
    () => VAULTS.map((vault) => new PublicKey(vault.marketPubkeyString)),
    []
  );

  const hasLoadedNativeVaultsStats =
    !isLoadingOffChainVaultsStats && marketsOnChainDataLookup && isMarketStatsLoaded;

  useEffect(() => {
    if (normalClient && normalClientIsReady && connection) {
      getMultipleOnChainVaultData(normalClient, connection, vaultsToFetch).then(
        (lookup) => {
          setMarketsOnChainDataLookup(lookup);
        }
      );
    }
  }, [normalClient, connection, vaultsToFetch]);

  /**
   * Syncs the markets' stats in markets store. Mainly updates in terms of oracle price (through `getOraclePriceForMarket`)
   */
  useEffect(() => {
    if (offChainVaultsStats && marketsOnChainDataLookup) {
      const marketStatsLookup: AppStoreState['marketsStats'] = {};

      vaultsToFetch.forEach((marketPubkey) => {
        const marketPubkeyString = marketPubkey.toString();
        const onChainData = marketsOnChainDataLookup[marketPubkeyString];
        const offChainData = offChainVaultsStats[marketPubkeyString];

        if (onChainData && offChainData) {
          const vaultStat = constructMarketStats(
            marketPubkeyString,
            marketsOnChainDataLookup[marketPubkeyString],
            offChainVaultsStats[marketPubkeyString],
            getOraclePriceForMarket
          );

          marketStatsLookup[marketPubkeyString] = vaultStat;
        }
      });

      if (Object.keys(marketStatsLookup).length > 0) {
        setVaultsStore((s) => {
          s.marketsStats = {
            ...s.marketsStats,
            ...marketStatsLookup,
          };
        });
        setIsMarketStatsLoaded(true);
      }
    }
  }, [offChainVaultsStats, marketsOnChainDataLookup, getOraclePriceForMarket, vaultsToFetch]);

  return hasLoadedNativeVaultsStats;
};

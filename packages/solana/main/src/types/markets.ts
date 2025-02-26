import { BigNum, BN } from "@normalfinance/solana-sdk";

// export type PeriodApys = {
//   "7d": number;
//   "30d": number;
//   "90d": number;
// };

// export type ApyReturnsLookup = Record<
//   string,
//   {
//     apys: PeriodApys;
//     maxDrawdownPct: number;
//     numOfVaultSnapshots: number;
//   }
// >;

/**
 * Stats that are derived from on-chain data.
 */
export interface OnChainMarketStats {
//   capacityPct: number;
//   isUncappedCapacity: boolean;
//   totalBasePnl: BigNum;
//   totalQuotePnl: BigNum;
//   tvlBase: BigNum;
//   tvlQuote: BigNum;
//   volume30Days: BigNum;
//   totalShares: BigNum;
//   profitShare: number;
//   vaultRedeemPeriodSecs: BN;
//   notionalGrowthQuotePnl: BigNum;
//   hasLoadedOnChainStats: boolean;
}

/**
 * Stats that are derived from off-chain data.
 */
export interface OffChainMarketStats {
//   apys: PeriodApys;
//   maxDrawdownPct: number;
//   numOfVaultSnapshots: number;
//   hasLoadedOffChainStats: boolean;
}

export type MarketStats = OnChainMarketStats & OffChainMarketStats;
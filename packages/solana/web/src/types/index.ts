import { BN, BigNum, MarketType, BalanceType, TradeSide } from '@normalfinance/solana-sdk';
import { PublicKey } from '@solana/web3.js';
import {
  SerializableUserSnapshotRecord,
  UISerializableAccountSnapshot,
  UISerializableAllTimePnlData,
  UISerializableUserSnapshotRecord,
} from '../serializableTypes';

export * from './MarketId';
export * from './UIMarket';

// Opaque type pattern
export type Opaque<K, T> = T & { __TYPE__: K };

// TODO-v2 cleanup these types - most of them should have moved into serializableTypes
// # UI ↔ History Server Data Types

export class SnapshotEpochResolution {
  static readonly HOURLY = { hourly: {} };
  static readonly DAILY = { daily: {} };
  static readonly WEEKLY = { weekly: {} };
  static readonly MONTHLY = { monthly: {} };
}

export type UIAccountSnapshot = Pick<UserSnapshotRecord, 'authority' | 'user' | 'epochTs'> &
  Pick<
    UISerializableUserSnapshotRecord,
    | 'cumulativeDepositQuoteValue'
    | 'cumulativeWithdrawalQuoteValue'
    | 'totalAccountValue'
    | 'cumulativeReferralReward'
    | 'cumulativeReferralVolume'
    | 'cumulativeReferralCount'
  > & {
    allTimeTotalPnl: BigNum;
    allTimeTotalPnlPct: BigNum;
  };

export type AccountSnapshot = Pick<UserSnapshotRecord, 'authority' | 'user' | 'epochTs'> &
  Pick<
    SerializableUserSnapshotRecord,
    | 'cumulativeDepositQuoteValue'
    | 'cumulativeWithdrawalQuoteValue'
    | 'totalAccountValue'
    | 'cumulativeReferralReward'
    | 'cumulativeReferralVolume'
    | 'cumulativeReferralCount'
  > & {
    allTimeTotalPnl: BN;
    allTimeTotalPnlPct: BN;
  };

export type UserSnapshotRecord = {
  programId: PublicKey;
  authority: PublicKey;
  user: PublicKey;
  epochTs: number;
  ts: number;
  perpPositionUpnl: BN;

  totalAccountValue: BN;
  cumulativeDepositQuoteValue: BN;
  cumulativeWithdrawalQuoteValue: BN;
  cumulativeSettledPerpPnl: BN;
  cumulativeReferralReward: BN;
  cumulativeReferralVolume: BN;
  cumulativeReferralCount: number;
};

export type PnlSnapshotOrderOption = keyof Pick<RollingPnlData, 'totalPnlPct' | 'totalPnlQuote'>;

export type PnlHistoryDataPoint = {
  val: number;
  ts: number;
};

export type LeaderBoardResultRow = {
  user: PublicKey;
  authority: PublicKey;
  subaccountId: number;
  resolution: SnapshotEpochResolution;
  rollingValue: number;
  pnlHistoryPoints: PnlHistoryDataPoint[];
};

export type LeaderboardResult = {
  lastUpdateTs: number;
  results: LeaderBoardResultRow[];
  ordering: PnlSnapshotOrderOption;
};

export type MarketDetails24H = {
  marketType: MarketType;
  marketIndex: number;
  symbol: string;
  baseVolume: number;
  quoteVolume: number;
  baseVolume30D: number;
  quoteVolume30D: number;
  price24hAgo: number;
  pricePercentChange: number;
  priceHigh: number;
  priceLow: number;
  avgFunding?: number;
  avgLongFunding?: number;
  avgShortFunding?: number;
  marketCap: number;
  dailyVolumeIncreaseZScore: number;
};

export type BankBalanceUI = SpotPosition & {
  accountId: number;
  accountName: string;
  accountAuthority: PublicKey;
};

export type AuctionParams = {
  auctionStartPrice: BN;
  auctionEndPrice: BN;
  auctionDuration: number;
  constrainedBySlippage?: boolean; // flag to tell the UI that end price is constrained by max slippage tolerance
};

export type MarketMakerRewardRecord = {
  ts: number;
  amount: number;
  symbol: string;
};

export type OpenPosition = {
  marketIndex: number;
  marketSymbol: string;
  direction: 'short' | 'long';
  notional: BN;
  baseSize: BN;
  entryPrice: BN;
  exitPrice: BN;
  liqPrice: BN;
  pnlVsOracle: BN;
  pnlVsMark: BN;
  quoteAssetNotionalAmount: BN;
  quoteEntryAmount: BN;
  quoteBreakEvenAmount: BN;
  unrealizedFundingPnl: BN;
  feesAndFundingPnl: BN;
  lastCumulativeFundingRate: BN;
  openOrders: number;
  unsettledPnl: BN;
  unsettledFundingPnl: BN;
  totalUnrealizedPnl: BN;
  costBasis: BN;
  realizedPnl: BN;
  lpShares: BN;
  pnlIsClaimable: boolean;
  remainderBaseAmount?: number; // LP only
  lpDeriskPrice?: BN; //LP only
};

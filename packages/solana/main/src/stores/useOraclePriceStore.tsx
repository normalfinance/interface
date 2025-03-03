import { produce } from 'immer';
import { create } from 'zustand';
import { OraclePriceData } from '@normalfinance/solana-sdk';
import { MarketId, UIMarket } from '@/types';

export type FormattedOraclePriceData = {
  price: number;
  slot: number;
  confidence: number;
  twap?: number;
  twapConfidence?: number;
  maxPrice?: number;
};

export type OraclePriceInfo = {
  market: UIMarket;
  priceData: FormattedOraclePriceData;
  rawPriceData: OraclePriceData;
};

export interface OraclePriceStore {
  set: (x: (s: OraclePriceStore) => void) => void;
  get: (x: any) => OraclePriceStore;
  getMarketPriceData: (market: MarketId) => OraclePriceInfo;
  symbolMap: {
    [index: string]: OraclePriceInfo;
  };
}

export const useOraclePriceStore = create<OraclePriceStore>((set, get) => ({
  set: (fn) => set(produce(fn)),
  get: () => get(),
  getMarketPriceData: (market: MarketId) => get().symbolMap[market.key],
  symbolMap: {},
}));

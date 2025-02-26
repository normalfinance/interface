import { produce } from 'immer';
import { create } from 'zustand';
import { NormalClient } from '@normalfinance/solana-sdk';
import { MarketStats } from '@/types/markets';

export interface AppStoreState {
  set: (x: (s: AppStoreState) => void) => void;
  get: () => AppStoreState;
  normalClient: NormalClient | null;
  marketsStats: Record<string, MarketStats>;
}

const DEFAULT_APP_STORE_STATE = {};

const useAppStore = create<AppStoreState>((set, get) => {
  const setProducerFn = (fn: (s: AppStoreState) => void) => set(produce(fn));
  return {
    ...DEFAULT_APP_STORE_STATE,
    set: setProducerFn,
    get: () => get(),
    normalClient: null,
    marketsStats: {},
  };
});

export default useAppStore;

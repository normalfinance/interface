import { StoreApi, UseBoundStore, create } from 'zustand';
import { produce } from 'immer';
import {
  BigNum,
  BulkAccountLoader,
  NormalClient,
  NormalEnv,
  QUOTE_PRECISION_EXP,
  User,
  UserAccount,
  MarketAccount,
  initialize,
} from '@normalfinance/solana-sdk';
import { Connection, PublicKey } from '@solana/web3.js';

// @ts-ignore
import type { WalletContextState } from '@solana/wallet-adapter-react';
import createNormalActions from '../actions/normalActions';

// any relevant user data we can keep up to date here
export type UserData = {
  user: User | undefined;
  userAccount: UserAccount | undefined;
  // spotPositions: SpotPosition[];
  // leverage: number;
  accountId: number | undefined;
};

const DEFAULT_SOL_BALANCE = {
  value: BigNum.zero(QUOTE_PRECISION_EXP),
  loaded: false,
};

export type SpotMarketData = {
  tvl: BigNum;
  deposits: BigNum;
  borrows: BigNum;
  currentPrice: BigNum;
  solBorrowCapacityRemaining: BigNum;
  percentOfCapUsed: number;
};
export interface CommonNormalStore {
  authority: PublicKey | null | undefined;
  authorityString: string;
  currentlyConnectedWalletContext: WalletContextState | null;
  currentSolBalance: {
    value: BigNum;
    loaded: boolean;
  };
  connection: Connection | undefined;
  env: {
    normalEnv: NormalEnv;
    basePollingRateMs: number;
    priorityFeePollingMultiplier: number;
    rpcOverride: string | undefined;
    isDev?: boolean;
    subscribeToAccounts?: boolean;
    txSenderRetryInterval: number;
    additionalTxSenderCallbacks?: ((base58EncodedTx: string) => void)[];
  };
  sdkConfig: ReturnType<typeof initialize> | undefined;
  normalClient: {
    client?: NormalClient;
    updateSignaler: any;
    isSubscribed: boolean;
  };
  checkIsNormalClientReady: () => boolean;
  subscribedToSubaccounts: boolean | undefined;
  isGeoBlocked: boolean;
  emulationMode: boolean;
  pollingMultiplier: number;
  bulkAccountLoader: BulkAccountLoader | undefined;
  userAccounts: UserAccount[];
  userAccountNotInitialized: boolean | undefined;
  set: (x: (s: CommonNormalStore) => void) => void;
  get: () => CommonNormalStore;
  clearUserData: () => void;
  actions: ReturnType<typeof createNormalActions>;
}

const defaultState = {
  authority: undefined,
  authorityString: '',
  currentlyConnectedWalletContext: null,
  currentSolBalance: DEFAULT_SOL_BALANCE,
  connection: undefined,
  sdkConfig: undefined,
  normalClient: {
    client: undefined,
    updateSignaler: {},
    isSubscribed: false,
  },
  subscribedToSubaccounts: undefined,
  isGeoBlocked: false,
  emulationMode: false,
  pollingMultiplier: 1,
  bulkAccountLoader: undefined,
  userAccounts: [],
  userAccountNotInitialized: undefined,
};

let useCommonNormalStore: UseBoundStore<StoreApi<CommonNormalStore>>;

const initializeNormalStore = (Env: CommonNormalStore['env']) => {
  if (!useCommonNormalStore) {
    useCommonNormalStore = create<CommonNormalStore>()((set, get) => {
      const setProducerFn = (fn: (s: CommonNormalStore) => void) => set(produce(fn));

      const actions = createNormalActions(get, setProducerFn);

      return {
        ...defaultState,
        env: Env,
        set: setProducerFn,
        get: () => get(),
        checkIsNormalClientReady: () => {
          const normalClient = get().normalClient;
          return (
            !!normalClient.client && normalClient.client.isSubscribed && normalClient.isSubscribed
          );
        },
        clearUserData: () => {
          setProducerFn((s) => {
            s.authority = undefined;
            s.authorityString = '';
            s.currentSolBalance = DEFAULT_SOL_BALANCE;
            s.currentlyConnectedWalletContext = null;
            s.userAccounts = [];
            s.userAccountNotInitialized = undefined;
          });
        },
        actions,
      };
    });
  }
};

export { initializeNormalStore, useCommonNormalStore };

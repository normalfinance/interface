import {
  SynthMarketAccount,
  SynthOperation,
  isOperationPaused,
  InsuranceFundOperation,
} from '@normalfinance/solana-sdk';

const getBaseAssetSymbol = (marketName: string, removePrefix = false) => {
  let baseAssetSymbol = marketName.replace('-PERP', '').replace('/USDC', '');

  if (removePrefix) {
    baseAssetSymbol = baseAssetSymbol.replace('1K', '').replace('1M', '');
  }

  return baseAssetSymbol;
};

const SynthOperationsMap = {
  AMM_FILL: 'AMM Fills',
  FILL: 'Fills',
  SETTLE_PNL_WITH_POSITION: 'Settle P&L With Open Position',
};

const InsuranceFundOperationsMap = {
  INIT: 'Initialize IF',
  ADD: 'Deposit To IF',
  REQUEST_REMOVE: 'Request Withdrawal From IF',
  REMOVE: 'Withdraw From IF',
};

const getPausedOperations = (marketAccount: SynthMarketAccount): string[] => {
  if (!marketAccount) return [];

  const pausedOperations = [];
  //@ts-ignore
  const isSynth = !!marketAccount.amm;

  // check perp operations
  if (isSynth) {
    Object.keys(SynthOperation)
      .filter((operation) =>
        isOperationPaused(marketAccount.pausedOperations, SynthOperation[operation])
      )
      .forEach((pausedOperation) => {
        pausedOperations.push(SynthOperationsMap[pausedOperation]);
      });
  } else {
    // check IF operations
    Object.keys(InsuranceFundOperation)
      .filter((operation) =>
        isOperationPaused(
          //@ts-ignore
          marketAccount.ifPausedOperations,
          InsuranceFundOperation[operation]
        )
      )
      .forEach((pausedOperation) => {
        pausedOperations.push(InsuranceFundOperationsMap[pausedOperation]);
      });
  }

  return pausedOperations;
};

export const MARKET_COMMON_UTILS = {
  getBaseAssetSymbol,
  getPausedOperations,
  SynthOperationsMap,
  InsuranceFundOperationsMap,
};

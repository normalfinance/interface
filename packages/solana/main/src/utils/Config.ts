import { NormalEnv, initialize, MarketConfig } from '@normalfinance/solana-sdk';

export const Config: {
  initialized: boolean;
  marketsLookup: MarketConfig[];
  sdkConfig: ReturnType<typeof initialize>;
} = {
  initialized: false,
  marketsLookup: [],
  sdkConfig: undefined,
};

export const Initialize = (env: NormalEnv) => {
  const SDKConfig = initialize({ env });

  const maxMarketIndex = Math.max(...SDKConfig.MARKETS.map((market) => market.marketIndex));

  const markets = new Array(maxMarketIndex);

  SDKConfig.MARKETS.forEach((perpMarket) => {
    markets[perpMarket.marketIndex] = perpMarket;
  });

  Config.marketsLookup = markets;

  Config.initialized = true;
};

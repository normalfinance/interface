'use client';

import { use } from 'react';
import { useMarket } from '@/hooks/market';
import MarketView from '@/sections/market';

export default function MarketPage(props: {
  params: Promise<{
    marketPubkey: string;
  }>;
}) {
  const params = use(props.params);
  const marketPubkey = params.marketPubkey;
  const uiMarketConfig = getUiMarketConfig(marketPubkey);

  const {
    marketAccountData,
    // marketDepositorAccountData,
    // isMarketDepositorLoaded,
    syncMarketStats,
  } = useMarket(marketPubkey);

  if (!uiMarketConfig || !marketAccountData) {
    return <div>Market not found</div>;
  }

  return (
    <MarketView
      marketPubkey={marketPubkey}
      marketAccountData={marketAccountData}
      syncMarketStats={syncMarketStats}
    />
  );
}

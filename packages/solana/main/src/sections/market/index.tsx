'use client';

import { DashboardContent } from '@/layouts/dashboard';
import { MarketAccount } from '@normalfinance/solana-sdk';

type Props = {
  marketPubkey: string;
  vaultAccountData: MarketAccount | undefined;
  syncVaultStats: () => void;
};

export default function MarketView(props: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <div>
        <h1 className="text-2xl font-bold">{uiMarketConfig?.name}</h1>
        <p>Market Pubkey: {props.marketPubkey}</p>
        <p>Description: {uiMarketConfig?.description}</p>

        {/* TODO: Content */}
      </div>
    </DashboardContent>
  );
}

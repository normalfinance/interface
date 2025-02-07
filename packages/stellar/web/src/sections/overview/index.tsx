'use client';

import Grid2 from '@mui/material/Grid2';
import { AssetsAndLiabilities } from '@/components/_overview-page-components/assets-and-liabilities/assets-and-liabilities';
import { PortfolioValue } from '@/components/_overview-page-components/portfolio-value/portfolio-value';
import { DashboardContent } from '@/layouts/dashboard';
import { TradingVolume } from '@/components/_overview-page-components/trading-volume/trading-volume';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { Markets } from '@/components/_overview-page-components/markets/markets';
import { MarketTable } from '@/components/_overview-page-components/market-table/market-table';

export default function OverviewView() {
  const theme = useTheme();

  //  AssetsAndLiabilities tmp props
  const _appRelated = [
    {
      id: '1',
      name: 'Microsoft office 365',
      size: 1024,
      price: 0,
      shortcut: '/assets/icons/apps/ic-app-1.webp',
      downloaded: 1500,
      ratingNumber: 4.5,
      totalReviews: 100,
    },
  ];

  // TradingVolume data array with titles.
  const tradingVolumeData = [
    {
      title: 'Total 24h Trading Volume',
      percent: 0.6,
      total: 212350000,
    },
    {
      title: 'Total 30d Trading Volume',
      percent: -80.6,
      total: 5690000000,
    },
    {
      title: 'Total Value Locked',
      percent: 0.6,
      total: 883470000,
    },
  ];

  // Markets tmp props
  const _markets = [
    {
      id: '1',
      name: 'BTC-SOL',
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
      price: 1.69,
      percentage: -2.5,
      url: '/markets/btc-sol',
    },
    {
      id: '2',
      name: 'ETH-SOL',
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg',
      price: 55.47,
      percentage: 5.2323425,
      url: '/markets/eth-sol',
    },
    {
      id: '3',
      name: 'XRP-SOL',
      coverUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=040',
      price: 93.1,
      percentage: 3.1,
      url: '/markets/xrp-sol',
    },
  ];

  // Markets with titles
  const marketGroups = [
    { id: 'new_markets', title: 'New Markets', list: _markets },
    { id: 'trending_markets', title: 'Trending Markets', list: _markets },
    { id: 'top_gainer_markets', title: 'Top Gainer Markets', list: _markets },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={1}>
        <Typography variant="h4" color="text.primary">
          Welcome back 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Account Overview
        </Typography>
      </Stack>
      {/* First row: PortfolioValue/AssetsAndLiabilities */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          {/* props are in utils/portfolio-value-chart-series.ts */}
          <PortfolioValue id="portfolio_value" title="Portfolio Value" />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <AssetsAndLiabilities title="Assets & Liabilities" list={_appRelated} />
        </Grid2>
      </Grid2>
      {/* Second row: TradingVolume items */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        {tradingVolumeData.map((item, index) => (
          <Grid2 key={index} size={{ xs: 12, md: 4 }}>
            <TradingVolume title={item.title} percent={item.percent} total={item.total} />
          </Grid2>
        ))}
      </Grid2>
      {/* Third row: Markets items */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        {marketGroups.map((group) => (
          <Grid2 key={group.id} size={{ xs: 12, md: 4 }}>
            <Markets id={group.id} title={group.title} list={group.list} />
          </Grid2>
        ))}
      </Grid2>
      {/* Fourth row: Markets table */}
      <Grid2 sx={{ mt: 3 }}>
        <MarketTable />
      </Grid2>
    </DashboardContent>
  );
}

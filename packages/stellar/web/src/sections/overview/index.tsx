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
import { createChartData, RealtimeChartData } from 'src/utils/portfolio-value-chart-series';

export default function OverviewView() {
  const theme = useTheme();

  // -------------------------
  // Hardcoded chart data arrays and current balance.
  // -------------------------

  const data24h = [
    3444, 3600, 3750, 3900, 4100, 4300, 4500, 4700, 4900, 5200, 5400, 5500, 5650, 5800, 6000, 6200,
    6400, 6600, 6800, 7000, 7200, 7300, 7320, 7334,
  ];

  const data7d = [3444, 4000, 4800, 5200, 5800, 6800, 7334];

  const data30d = [
    3444, 3500, 3600, 3700, 3800, 3900, 4000, 4200, 4300, 4400, 4500, 4600, 4800, 5000, 5200, 5400,
    5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7100, 7200, 7250, 7300, 7320, 7330, 7334,
  ];

  // Generate x-axis labels dynamically.
  // For 24h: hourly labels ("00:00", "01:00", ..., "23:00")
  const categories24h = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  // For 7d: generate 7 labels based on the past 7 days.
  // The last label will be today's weekday.
  const categories7d = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    // i=0: 6 days ago, i=6: today.
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  // For 30d: generate 31 labels, where the last label is today's date (e.g., "Aug 24").
  const categories30d = Array.from({ length: 31 }, (_, i) => {
    const d = new Date();
    // i=0: 30 days ago, i=30: today.
    d.setDate(d.getDate() - (30 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Create chart data objects using our helper.
  const chartData24h = createChartData('24h', data24h, categories24h, 8);
  const chartData7d = createChartData('7d', data7d, categories7d, 7);
  const chartData30d = createChartData('30d', data30d, categories30d, 8);

  // Combine chart data into one object.
  const portfolioChartData: { [key in '24h' | '7d' | '30d']: RealtimeChartData } = {
    '24h': chartData24h,
    '7d': chartData7d,
    '30d': chartData30d,
  };

  // -------------------------
  // Other temporary props.
  // -------------------------
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
          <PortfolioValue
            id="portfolio_value"
            title="Portfolio Value"
            chart={portfolioChartData}
            legendValues={[chartData24h.series[0].data[0].data.slice(-1)[0]]}
          />
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

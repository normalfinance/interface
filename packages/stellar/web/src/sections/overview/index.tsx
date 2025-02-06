'use client';

import Grid2 from '@mui/material/Grid2';
import { AssetsAndLiabilities } from '@/components/_overview-page-components/assets-and-liabilities/assets-and-liabilities';
import { PortfolioValue } from '@/components/_overview-page-components/portfolio-value/portfolio-value';
import { DashboardContent } from '@/layouts/dashboard';
import { TradingVolume } from '@/components/_overview-page-components/trading-volume/trading-volume';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

export default function OverviewView() {
  const theme = useTheme();

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

  // Define dynamic balance values (for example, current balance and secondary metric)
  // These values will be formatted (e.g. "5.00k" if using fShortenNumber)
  const legendValues = [5344, 6789];

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
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <PortfolioValue
            id="demo__4"
            title="Portfolio Value"
            legendValues={legendValues}
            chart={{
              // Global fallback categories (not used if series provide their own)
              categories: [],
              series: [
                {
                  name: '24h',
                  categories: [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00',
                  ],
                  data: [
                    {
                      name: 'Balance',
                      data: [
                        10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49, 20, 30, 40, 50, 60, 70, 80,
                        90, 100, 110, 120, 130,
                      ],
                    },
                  ],
                },
                {
                  name: '7d',
                  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  data: [
                    {
                      name: 'Balance',
                      data: [51, 35, 41, 10, 91, 69, 62],
                    },
                  ],
                },
                {
                  name: '30d',
                  categories: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
                  data: [
                    {
                      name: 'Balance',
                      data: Array.from({ length: 30 }, (_, i) => i * 10 + 5),
                    },
                  ],
                },
              ],
            }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <AssetsAndLiabilities title="Assets & Liabilities" list={_appRelated} />
        </Grid2>
      </Grid2>

      {/* Second row: TradingVolume items */}
      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TradingVolume title="Total 24h Trading Volume" percent={0.6} total={212350000} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TradingVolume title="Total 30d Trading Volume" percent={-80.6} total={5690000000} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <TradingVolume title="Total Value Locked" percent={0.6} total={883470000} />
        </Grid2>
      </Grid2>
    </DashboardContent>
  );
}

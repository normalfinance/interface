'use client';
import Grid2 from '@mui/material/Grid2';
import { DashboardContent } from '@/layouts/dashboard';
import { Stack, Typography, useTheme } from '@mui/material';
import { StatCard } from '@/components/_common/stat-card';
import { fShortenNumber, fRawPercent, fCurrency } from 'src/utils/format-number';
import type { ChartOptions } from 'src/components/chart';
import { StatCardData } from '@/types/stat-card-data';
import { CurrentBalance } from '@/components/_common/current-balance-card';

export default function InsuranceView() {
  const theme = useTheme();

  // Stat card data array
  const statCardsData: StatCardData[] = [
    {
      title: 'Normal Buffer',
      percent: 1.2,
      total: 139390,
      formatter: fShortenNumber,
      chartType: 'bar',
      displayChart: true,
      chart: {
        colors: [theme.palette.success.light, theme.palette.success.main],
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [139390, 134590, 149390, 169390, 139390, 179390, 149390],
      },
    },
    {
      title: 'Normal Insurance Fund',
      percent: -0.8,
      total: 74930,
      formatter: fShortenNumber,
      chartType: 'bar',
      displayChart: true,
      chart: {
        colors: [theme.palette.info.light, theme.palette.info.main],
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [24930, 34930, 64930, 74930, 24930, 54930, 74930],
      },
    },
    {
      title: 'Current Insurance Fund Yield',
      percent: 2.1,
      total: 7.981,
      formatter: fRawPercent,
      chartType: 'bar',
      displayChart: true,
      chart: {
        colors: [theme.palette.warning.light, theme.palette.warning.main],
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [2.981, 7.981, 7.981, 10, 4.981, 3.981, 7.981],
      },
    },
  ];

  // Current balance data array for the CurrentBalance component
  const currentBalanceData = [
    {
      title: 'Current balance',
      yieldPercent: 92.84,
      refunded: 6.73,
      staked: 1400,
      currentBalance: 1492.84,
      rows: [
        { label: 'Staked', value: 1400, formatter: fCurrency },
        { label: 'Earned', value: 92.84, formatter: fCurrency },
        { label: 'Yield', value: 6.73, formatter: fRawPercent },
      ],
      // Cast color and variant to the specific literal types
      actionButtons: [
        {
          label: 'Deposit',
          color: 'primary' as 'primary',
          onClick: () => {
            alert('Deposit');
          },
          variant: 'contained' as 'contained',
        },
        {
          label: 'Withdraw',
          color: 'error' as 'error',
          onClick: () => {
            alert('Withdraw');
          },
          variant: 'contained' as 'contained',
        },
      ],
    },
    // Add more items here if needed...
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={1}>
        <Typography variant="h4" color="text.primary">
          Insurance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review how insured the Normal Protocol is and earn yield by providing additional funds
        </Typography>
      </Stack>

      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        {statCardsData.map((item, index) => (
          <Grid2 key={index} size={{ xs: 12, md: 4 }}>
            <StatCard
              title={item.title}
              percent={item.percent}
              total={item.total}
              formatter={item.formatter}
              chartType={item.chartType}
              displayChart={item.displayChart}
              chart={item.chart}
            />
          </Grid2>
        ))}
      </Grid2>

      <Stack sx={{ mt: 3, maxWidth: '976px', mx: 'auto', px: 2 }} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          Insurance covering protocol debt is covered first by the Normal Buffer, which receives a
          portion of protocol revenue, and then by the Normal Insurance Fund, which pays yield to
          3rd party liquidity providers.
        </Typography>
      </Stack>

      <Grid2 container spacing={3} sx={{ mt: 3 }}>
        {currentBalanceData.map((balance, index) => (
          <Grid2 key={index} size={{ xs: 12, md: 4 }}>
            <CurrentBalance
              title={balance.title}
              yieldPercent={balance.yieldPercent}
              refunded={balance.refunded}
              staked={balance.staked}
              currentBalance={balance.currentBalance}
              rows={balance.rows}
              actionButtons={balance.actionButtons} // Optional, if provided
            />
          </Grid2>
        ))}
        <Grid2 size={{ xs: 12, md: 8 }}></Grid2>
      </Grid2>
    </DashboardContent>
  );
}

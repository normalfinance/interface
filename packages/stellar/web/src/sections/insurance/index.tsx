'use client';
import Grid2 from '@mui/material/Grid2';
import { DashboardContent } from '@/layouts/dashboard';
import { Stack, Typography, useTheme } from '@mui/material';
import { StatCard } from '@/components/_common/stat-card';
import { fShortenNumber, fRawPercent } from 'src/utils/format-number';
import type { ChartOptions } from 'src/components/chart';
import { StatCardData } from '@/types/stat-card-data';

export default function InsuranceView() {
  const theme = useTheme();

  const statCardsData: StatCardData[] = [
    {
      title: 'Normal Buffer',
      percent: 1.2,
      total: 139390,
      formatter: fShortenNumber,
      chartType: 'bar', // typed literal
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

      <Stack sx={{ mt: 3, maxWidth: '976px', mx: 'auto' }} textAlign={'center'}>
        <Typography variant="body1" color="text.secondary">
          Insurance covering protocol debt is covered first by the Normal Buffer, which receives a
          portion of protocol revenue, and then by the Normal Insurance Fund, which pays yield to
          3rd party liquidity providers.
        </Typography>
      </Stack>
    </DashboardContent>
  );
}

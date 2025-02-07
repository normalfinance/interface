'use client';

import type { CardProps } from '@mui/material/Card';

import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';
import { Chart, ChartSelect, ChartLegends, useChart } from 'src/components/chart';

// Import realtime chart data generator from our helper.
import { getRealtimeChartData } from 'src/utils/portfolio-value-chart-series';

type Props = CardProps & {
  title?: string;
  subheader?: string;
  // Legend values represent current balance or related metrics.
  legendValues?: number[];
};

export function PortfolioValue({ title, subheader, legendValues, sx, ...other }: Props) {
  const theme = useTheme();
  const [selectedSeries, setSelectedSeries] = useState<'24h' | '7d' | '30d'>('24h');

  // Generate realtime chart data for the selected timeframe.
  const realtimeData = getRealtimeChartData(selectedSeries);

  // Build chart options.
  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: realtimeData.categories,
      tickAmount: realtimeData.tickAmount,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => fShortenNumber(value),
      },
    },
  });

  const handleChangeSeries = useCallback((newValue: string) => {
    if (newValue === '24h' || newValue === '7d' || newValue === '30d') {
      setSelectedSeries(newValue);
    }
  }, []);

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={['24h', '7d', '30d']}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        // Legend labels from the realtime data's series data items.
        labels={realtimeData.series[0].data.map((item) => item.name)}
        // Legend values: if provided, format them; otherwise, use the current balance.
        values={
          legendValues
            ? legendValues.map((v) => fShortenNumber(v))
            : [
                // Get the last value from the generated data:
                fShortenNumber(realtimeData.series[0].data[0].data.slice(-1)[0]),
              ]
        }
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="area"
        series={realtimeData.series[0].data}
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}

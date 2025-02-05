'use client';

import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';
import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

type Props = CardProps & {
  title?: string;
  subheader?: string;
  // New prop for dynamic legend values
  legendValues?: number[];
  chart: {
    colors?: string[];
    // Global fallback categories (if series don’t provide their own)
    categories?: string[];
    series: {
      name: string;
      // Each series can optionally provide its own categories
      categories?: string[];
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ChartOptions;
  };
};

export function PortfolioValue({ title, subheader, chart, legendValues, sx, ...other }: Props) {
  const theme = useTheme();
  const [selectedSeries, setSelectedSeries] = useState('24h');

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

  // Find the currently selected series.
  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  // Use categories from the current series if available, otherwise fallback to global categories.
  const currentCategories = currentSeries?.categories || chart.categories || [];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: currentCategories },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        // Use labels from the current series’ data items.
        labels={currentSeries ? currentSeries.data.map((item) => item.name) : []}
        // Use dynamic legend values if provided; otherwise fall back to hardcoded values.
        values={
          legendValues
            ? legendValues.map((v) => fShortenNumber(v))
            : [fShortenNumber(1234), fShortenNumber(6789)]
        }
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="area"
        series={currentSeries?.data}
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

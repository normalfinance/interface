'use client';

// @mui
import { useTheme, styled } from '@mui/material/styles';
// utils
import { fPercent, ASSET_COLOR_CODES } from '@normalfinance/utils';
// components
import Chart, { useChart } from '@/components/template/chart';
// import Decimal from 'decimal.js';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  assets: string[];
  weights: string[];
  unknownWeight: string;
};

export const IndexWeightsPieChart = ({ assets, weights, unknownWeight }: Props) => {
  const theme = useTheme();

  const colors = assets.map((asset) => ASSET_COLOR_CODES[asset] ?? '#000000');

  const series = assets.map((asset, index) => ({
    label: asset,
    value: weights[index],
  }));

  const chartSeries = series.map((i) => Number(i.value));

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {
      offsetY: 0,
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => fPercent(value * 100),
        title: {
          formatter: (asset: string) => asset,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value: string) => fPercent(Number(value) * 100),
            },
            total: {
              formatter: () => fPercent(100),
            },
          },
        },
      },
    },
  });

  return (
    <StyledChart
      dir="ltr"
      type="donut"
      series={chartSeries}
      options={chartOptions}
      height="280"
      width="100%"
    />
  );
};

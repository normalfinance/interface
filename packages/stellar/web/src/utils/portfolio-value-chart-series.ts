// src/utils/chartSeries.ts

export type RealtimeChartData = {
  series: {
    name: string;
    data: { name: string; data: number[] }[];
  }[];
  categories: string[];
  tickAmount: number;
};

/**
 * Creates a RealtimeChartData object given a timeframe, data array, categories, and tickAmount.
 */
export function createChartData(
  timeframe: '24h' | '7d' | '30d',
  data: number[],
  categories: string[],
  tickAmount: number
): RealtimeChartData {
  return {
    series: [
      {
        name: timeframe,
        data: [{ name: 'Balance', data }],
      },
    ],
    categories,
    tickAmount,
  };
}

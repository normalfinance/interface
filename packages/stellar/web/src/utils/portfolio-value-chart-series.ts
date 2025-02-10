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
 * Helper to generate x-axis categories based on the timeframe.
 * - "24h": returns ["00:00", "01:00", …, "23:00"].
 * - "7d": returns an array of 7 abbreviated weekday names, with the last being today's weekday.
 * - "30d": returns an array of 31 labels with dates (e.g., "Aug 24") where the last label is today.
 */
function getCategories(timeframe: '24h' | '7d' | '30d'): string[] {
  const now = new Date();
  if (timeframe === '24h') {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  } else if (timeframe === '7d') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
  } else if (timeframe === '30d') {
    return Array.from({ length: 31 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (30 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  }
  return [];
}

/**
 * createChartData
 * @param timeframe - one of '24h', '7d', or '30d'
 * @param data - array of numbers representing the balance over time
 * @param tickAmount - number of x-axis labels to display
 * @returns RealtimeChartData object
 */
export function createChartData(
  timeframe: '24h' | '7d' | '30d',
  data: number[],
  tickAmount: number
): RealtimeChartData {
  const categories = getCategories(timeframe);
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

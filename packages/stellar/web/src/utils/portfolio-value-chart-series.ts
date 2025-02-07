// src/utils/chartSeries.ts

export type RealtimeChartData = {
  series: {
    name: string;
    data: { name: string; data: number[] }[];
  }[];
  // Full x-axis labels for the entire data set.
  categories: string[];
  // Recommended tick amount for the x-axis.
  tickAmount: number;
};

/**
 * Generates "swinging" data using a sine wave plus random noise.
 * @param numPoints Number of data points.
 * @param currentBalance The final (current) balance value.
 * @param amplitude The amplitude for the swing variation.
 * @returns An array of numbers.
 */
function generateSwingData(numPoints: number, currentBalance: number, amplitude: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    // Map i from 0 to numPoints - 1 onto angle range -π/2 to 3π/2.
    const angle = (i / (numPoints - 1)) * Math.PI * 2 - Math.PI / 2;
    let value = currentBalance + amplitude * Math.sin(angle);
    // Optionally add a little noise:
    value += (Math.random() - 0.5) * (amplitude / 4);
    data.push(Math.round(value));
  }
  // Force the last value to equal the currentBalance.
  data[data.length - 1] = currentBalance;
  return data;
}

// Format a Date as "HH:00" (e.g., "07:00").
function formatHour(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:00`;
}

// Format a Date as an abbreviated weekday (e.g., "Mon").
function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Format a Date as "Aug 24" (month abbreviated, day numeric).
function formatMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Generates realtime chart data with swinging values.
 *
 * - For "24h": 24 data points (one per hour for the past 24 hours) with full hour labels.
 * - For "7d": 7 data points (one per day for the past 7 days) with abbreviated weekday labels.
 * - For "30d": 31 data points (today + 30 days back) with month/day labels.
 *
 * The tickAmount property is used to sample the x-axis labels (to avoid overcrowding).
 */
export function getRealtimeChartData(timeframe: '24h' | '7d' | '30d'): RealtimeChartData {
  const currentBalance = 7334; // Hardcoded current balance.
  const now = new Date();

  if (timeframe === '24h') {
    const numPoints = 24;
    // Generate hour labels for the past 24 hours.
    const categories = Array.from({ length: numPoints }, (_, i) => {
      const date = new Date(now.getTime() - (numPoints - 1 - i) * 60 * 60 * 1000);
      return formatHour(date);
    });
    // Generate swinging data from 5000 to currentBalance with an amplitude of 1500.
    const data = generateSwingData(numPoints, currentBalance, 1500);
    return {
      series: [
        {
          name: '24h',
          data: [{ name: 'Balance', data }],
        },
      ],
      categories,
      tickAmount: 8, // Show 8 labels on the x-axis.
    };
  } else if (timeframe === '7d') {
    const numPoints = 7;
    // Generate labels: For each of the past 7 days, use the abbreviated weekday.
    const categories = Array.from({ length: numPoints }, (_, i) => {
      const date = new Date(now.getTime() - (numPoints - 1 - i) * 24 * 60 * 60 * 1000);
      return formatDay(date);
    });
    // Generate swinging data from 4800 to currentBalance with an amplitude of 2000.
    const data = generateSwingData(numPoints, currentBalance, 2000);
    return {
      series: [
        {
          name: '7d',
          data: [{ name: 'Balance', data }],
        },
      ],
      categories,
      tickAmount: numPoints, // Show all 7 labels.
    };
  } else if (timeframe === '30d') {
    const numPoints = 31; // Today + 30 days back.
    // Generate labels: For each day, use the month/day format.
    const categories = Array.from({ length: numPoints }, (_, i) => {
      const date = new Date(now.getTime() - (numPoints - 1 - i) * 24 * 60 * 60 * 1000);
      return formatMonthDay(date);
    });
    // Generate swinging data from 4500 to currentBalance with an amplitude of 2500.
    const data = generateSwingData(numPoints, currentBalance, 2500);
    return {
      series: [
        {
          name: '30d',
          data: [{ name: 'Balance', data }],
        },
      ],
      categories,
      tickAmount: 8, // Sample to 8 labels on the x-axis.
    };
  }
  return { series: [], categories: [], tickAmount: 0 };
}

import { Metadata } from 'next';
import AnalyticsLiquidationsView from '@/sections/analytics/liquidations';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Analytics - Liquidations',
  description: '',
};

export default function Page() {
  return <AnalyticsLiquidationsView />;
}

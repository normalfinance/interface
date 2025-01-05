import { Metadata } from 'next';
import AnalyticsBankruptciesView from '@/sections/analytics/bankruptcies';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Analytics - Bankruptcies',
  description: '',
};

export default function Page() {
  return <AnalyticsBankruptciesView />;
}

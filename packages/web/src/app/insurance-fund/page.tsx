import { Metadata } from 'next';
import InsuranceFundView from '@/sections/insurance-fund';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Insurance Fund',
  description: '',
};

export default function Page() {
  return <InsuranceFundView />;
}

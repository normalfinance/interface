import { Metadata } from 'next';
import MarketsView from '@/sections/markets';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Markets',
  description: '',
};

export default function Page() {
  return <MarketsView />;
}

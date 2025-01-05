import { Metadata } from 'next';
import RewardsView from '@/sections/rewards';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Rewards',
  description: '',
};

export default function Page() {
  return <RewardsView />;
}

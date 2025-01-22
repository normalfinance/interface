import { Metadata } from 'next';
import GovernanceStakeView from '@/sections/governance/stake';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Governance - Stake',
  description: '',
};

export default function Page() {
  return <GovernanceStakeView />;
}

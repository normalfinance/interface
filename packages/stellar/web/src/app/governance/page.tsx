import { Metadata } from 'next';
import GovernanceView from '@/sections/governance';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Governance',
  description: '',
};

export default function Page() {
  return <GovernanceView />;
}

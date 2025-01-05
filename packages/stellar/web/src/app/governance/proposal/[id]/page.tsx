import { Metadata } from 'next';
import ProposalView from '@/sections/governance/proposal';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Governance - Proposal',
  description: '',
};

export default function Page() {
  return <ProposalView />;
}

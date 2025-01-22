import { Metadata } from 'next';
import GovernanceProposalView from '@/sections/governance/proposal';
import { useParams } from 'src/routes/hook';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Governance - Proposal',
  description: '',
};

interface Props {
  readonly params: Promise<{
    readonly poolAddress: string;
  }>;
}

export default function Page(props: Props) {
  const params = useParams();
  const { proposalId } = params;

  return <GovernanceProposalView proposalId={proposalId} />;
}

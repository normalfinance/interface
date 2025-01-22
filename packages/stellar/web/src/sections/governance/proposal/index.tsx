'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from '@normalfinance/utils';
// components
import { useSettingsContext } from '@normalfinance/ui';
import ProposalDetailsToolbar from '@/components/proposal/proposal-details-toolbar';
import ProposalDetailsContent from '@/components/proposal/proposal-details-content';
import { useGovernance } from '@/hooks/use-governance';

// ----------------------------------------------------------------------

export default function GovernanceProposalView(proposalId: number) {
  const { getProposalById } = useGovernance();

  const settings = useSettingsContext();

  // const currenProposal = [].filter((proposal) => proposal.id === proposalId)[0];
  const currentProposal = getProposalById(proposalId);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ProposalDetailsToolbar
        backLink={paths.governance.root}
        editLink={paths.dashboard.job.edit(`${currentProposal?.id}`)}
        liveLink="#"
      />

      <ProposalDetailsContent proposal={currentProposal} />
    </Container>
  );
}

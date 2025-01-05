'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import ProposalDetailsToolbar from '@/components/proposal/proposal-details-toolbar';
import ProposalDetailsContent from '@/components/proposal/proposal-details-content';
//

// ----------------------------------------------------------------------

export default function ProposalView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const currenProposal = [].filter((proposal) => proposal.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ProposalDetailsToolbar
        backLink={paths.governance.root}
        editLink={paths.dashboard.job.edit(`${currenProposal?.id}`)}
        liveLink="#"
      />

      <ProposalDetailsContent proposal={currenProposal} />
    </Container>
  );
}

// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

// components
import { ProposalItemSkeleton } from './proposal-skeleton';
import ProposalItemHorizontal from './proposal-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  proposals: Proposal[];
  loading?: boolean;
};

export default function GovernanceProposalListHorizontal({ proposals, loading }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <ProposalItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {proposals.map((proposal) => (
        <ProposalItemHorizontal key={proposal.id} proposal={proposal} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {proposals.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

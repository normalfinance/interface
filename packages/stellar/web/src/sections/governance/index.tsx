'use client';

import orderBy from 'lodash/orderBy';
import { useEffect, useCallback, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// hooks
import { useGovernance } from '@/hooks/use-governance';
// types
import { Proposal } from '@normalfinance/types';
// components
import { Trans, PageHeader, Label } from '@normalfinance/ui';
import ProposalSort from '@/components/governance/proposal-sort';
import GovernanceProposalListHorizontal from '@/components/governance/governance-proposal-list-horizontal';

// ----------------------------------------------------------------------

const defaultFilters = {
  publish: 'all',
};

export type IProposalFilterValue = string;

export type IProposalFilters = {
  publish: string;
};

// ----------------------------------------------------------------------

export default function GovernanceView() {
  const { error, loading, proposals, getProposals } = useGovernance();

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  const dataFiltered = applyFilter({
    inputData: proposals,
    filters,
    sortBy,
  });

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name: string, value: IProposalFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );

  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Proposals</Trans>}
        subheader={<Trans>Vote on how you think the Normal Protocol should be governed</Trans>}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <ProposalSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Stack>

      <Tabs
        value={filters.publish}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'active', 'discussion', 'finished'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
                color={(tab === 'active' && 'info') || 'default'}
              >
                {tab === 'all' && proposals.length}

                {tab === 'active' &&
                  proposals.filter((proposal) => proposal.publish === 'active').length}

                {tab === 'discussion' &&
                  proposals.filter((proposal) => proposal.publish === 'discussion').length}

                {tab === 'finished' &&
                  proposals.filter((proposal) => proposal.publish === 'finished').length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <GovernanceProposalListHorizontal proposals={dataFiltered} loading={loading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  inputData,
  filters,
  sortBy,
}: {
  inputData: Proposal[];
  filters: IProposalFilters;
  sortBy: string;
}) => {
  const { publish } = filters;

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  if (publish !== 'all') {
    inputData = inputData.filter((post) => post.publish === publish);
  }

  return inputData;
};

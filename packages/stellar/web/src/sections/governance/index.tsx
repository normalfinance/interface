'use client';

import orderBy from 'lodash/orderBy';
import { useEffect, useCallback, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// types
// components
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import ProposalSearch from '@/components/governance/proposal-search';
import ProposalSort from '@/components/governance/proposal-sort';
import GovernanceProposalListHorizontal from '@/components/governance/governance-proposal-list-horizontal';
import { useGovernance } from '@/hooks/use-governance';
//

// ----------------------------------------------------------------------

const defaultFilters = {
  publish: 'all',
};

// ----------------------------------------------------------------------

export default function GovernanceView() {
  const { error, loading, proposals, getProposals } = useGovernance();

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  const [search, setSearch] = useState<{ query: string; results: IPostItem[] }>({
    query: '',
    results: [],
  });

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

  const handleFilters = useCallback((name: string, value: IPostFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback(async (value: string) => {
    try {
      setSearch((prevState) => ({
        ...prevState,
        query: value,
      }));

      if (value) {
        const response = await axios.get(API_ENDPOINTS.post.search, {
          params: {
            query: value,
          },
        });

        setSearch((prevState) => ({
          ...prevState,
          results: response.data.results,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );

  return (
    <Container maxWidth="xl">
      <PageHeader title={<Trans>Proposals</Trans>} subheader={<Trans>add description</Trans>} />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <ProposalSearch
          search={search}
          onSearch={handleSearch}
          hrefItem={(title: string) => paths.dashboard.post.details(title)}
        />

        <ProposalSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
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
  inputData: IPostItem[];
  filters: IPostFilters;
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

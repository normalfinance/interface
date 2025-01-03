import CommunityIndexes from '@/components/community-indexes';
import HighlightedIndex from '@/components/highlighted-index';
import LoadingButtonModal from '@/components/loading-button-modal';
import NormalIndexes from '@/components/normal-indexes';
import PageHeader from '@/components/page-header';
import TVL from '@/components/tvl';
import { useIndexes } from '@/hooks/use-indexes';
import { Trans } from '@/i18n';
import { Container, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function IndexesView() {
  const { error, loading, indexes } = useIndexes();

  const trendingIndex = indexes[0];
  const staffPickIndex = indexes[1];
  const biggestGainerIndex = indexes[2];

  const isNormalIndex = (i: Index) => i.createdBy === 'normal';
  const [normalIndexes, communityIndexes] = splitByPredicate(indexes, isNormalIndex);

  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Crypto Indexes</Trans>}
        subheader={<Trans>add description</Trans>}
      />

      <LoadingButtonModal buttonText={<Trans>Create an index</Trans>}>
        <p></p>
      </LoadingButtonModal>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TVL loading amount={indexes.tvl} color="success" />
        </Grid>

        {/* Index Highlights */}
        <Grid xs={12} sm={6} md={4}>
          <HighlightedIndex title={<Trans>Trending</Trans>} index={trendingIndex} />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <HighlightedIndex title={<Trans>Staff Pick</Trans>} index={staffPickIndex} />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <HighlightedIndex title={<Trans>Highest Gainer</Trans>} index={biggestGainerIndex} />
        </Grid>

        {/* Indexes by Category */}
        <Grid item xs={12} md={12}>
          <NormalIndexes indexes={normalIndexes} />
        </Grid>

        <Grid item xs={12} md={12}>
          <CommunityIndexes indexes={communityIndexes} />
        </Grid>
      </Grid>
    </Container>
  );
}

function splitByPredicate<T>(array: T[], predicate: (element: T) => boolean): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], element) => {
      (predicate(element) ? pass : fail).push(element);
      return [pass, fail];
    },
    [[], []]
  );
}

import PageHeader from '@/components/page-header';
import Swap from '@/components/swap';
import { useIndexes } from '@/hooks/use-indexes';
import { Trans } from '@/i18n';
import { Container, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function SwapView() {
  // const { error, loading, indexes } = useIndexes();

  return (
    <Container maxWidth="xl">
      <PageHeader title={<Trans>Swap</Trans>} subheader={<Trans>add description</Trans>} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Swap userTokens={userTokens} />
        </Grid>
      </Grid>
    </Container>
  );
}

import PageHeader from '@/components/page-header';
import { Trans } from '@/i18n';
import { Container, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function AnalyticsLiquidationsView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Analytics - Liquidations</Trans>}
        subheader={<Trans>add description</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* ... */}
        </Grid>
      </Grid>
    </Container>
  );
}

// @mui
import { Container, Grid } from '@mui/material';

// components
import { Trans, PageHeader } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function AnalyticsLiquidationsView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Analytics - Liquidations</Trans>}
        subheader={<Trans>Stats about Synth Market liquidations</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* ... */}
        </Grid>
      </Grid>
    </Container>
  );
}

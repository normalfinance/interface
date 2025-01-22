// @mui
import { Container, Grid } from '@mui/material';

// components
import { Trans, PageHeader } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function AnalyticsBankruptciesView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Analytics - Bankruptcies</Trans>}
        subheader={<Trans>Things about bankruptcies</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* ... */}
        </Grid>
      </Grid>
    </Container>
  );
}

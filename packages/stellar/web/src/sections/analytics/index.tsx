// @mui
import { Container, Grid } from '@mui/material';

// components
import { Trans, PageHeader, NormalTVLChart, NormalVolumeChart } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Analytics</Trans>}
        subheader={<Trans>Stay up to date with how Normal is growing</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NormalTVLChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <NormalVolumeChart />
        </Grid>

        <p>
          Additional things to add: /** - Total TVL - Total Debt - Avg colateral yield - Total index
          TVL - Total indexes - - Daily trade volume - Daily trade fees/revenue - NORM token holders
          - veNORM stakers */
        </p>
      </Grid>
    </Container>
  );
}

import PageHeader from '@/components/page-header';
import { Trans } from '@/i18n';
import { Container, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  return (
    <Container maxWidth="xl">
      <PageHeader title={<Trans>Analytics</Trans>} subheader={<Trans>add description</Trans>} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NormalTVLChart />
        </Grid>

        <Grid item xs={12} md={6}>
          <NormalVolumeChart />
        </Grid>

        /** - Total TVL - Total Debt - Avg colateral yield - Total index TVL - Total indexes - -
        Daily trade volume - Daily trade fees/revenue - NORM token holders - veNORM stakers */
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </Container>
  );
}

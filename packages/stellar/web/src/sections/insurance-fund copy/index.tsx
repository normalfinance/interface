
import PageHeader from '@/components/page-header';
import { Trans } from '@/i18n';
import { Container, Grid, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function HomeView() {

  return (
    <Container maxWidth="xl">
      <PageHeader title={<Trans>Insurance</Trans>} subheader={<Trans>add description</Trans>} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TVL loading={loading} amount={insuranceFund.tvl} color={'success'} />
        </Grid>

        
      </Grid>
    </Container>
  );
}

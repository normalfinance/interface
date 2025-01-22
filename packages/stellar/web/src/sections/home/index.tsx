// @mui
import { Container, Grid } from '@mui/material';

// components
import { PageHeader, Trans } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function HomeView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Account Overview</Trans>}
        subheader={<Trans>add description</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </Container>
  );
}

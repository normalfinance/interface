// @mui
import { Container, Grid } from '@mui/material';

// utils
import { paths } from '@normalfinance/utils';

// components
import { PageHeader, Trans, CustomBreadcrumbs } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function MarketByIdView({}) {
  return (
    <Container maxWidth="xl">
      <PageHeader title={<Trans>Market by id</Trans>} subheader={<Trans>add description</Trans>} />

      <CustomBreadcrumbs
        // heading={<Trans>Account</Trans>}
        links={[
          { name: <Trans>Markets</Trans>, href: paths.home },
          { name: <Trans>this market</Trans>, href: paths.home },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8}></Grid>

        {/* Trade form */}
        <Grid item xs={12} md={4}></Grid>

        {/* User positions */}
        <Grid item xs={12} md={8}>
          <Data />
        </Grid>

        <Grid item xs={12} md={4}>
          <Stats
            stats={[
              {
                label: 'Test',
                value: 10,
              },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

'use client';

import { Alert } from '@mui/material';
// @mui
import Container from '@mui/material/Container';

// components
import { PageHeader, Trans } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function GovernanceStakeView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Normal Governance Staking</Trans>}
        subheader={<Trans>Stake your NORM tokens to participate in governance and more!</Trans>}
      />

      <Grid xs={12} md={8}>
        <Alert severity="info">Learn about Normal Governance</Alert>
      </Grid>

      <Grid xs={12} md={6} lg={8}>
        <GovernanceStakingOverview title="Sales Overview" data={_ecommerceSalesOverview} />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <EcommerceCurrentBalance
          title="Current Balance"
          currentBalance={187650}
          sentAmount={25500}
        />
      </Grid>

      <Grid xs={12} md={12} lg={12}>
        <JobList jobs={dataFiltered} />
      </Grid>
    </Container>
  );
}

import InsurnaceFundPositionCard from '@/components/insurance-fund-position-card';
import InsuranceFundTransactionsTable from '@/components/insurance-fund-transactions-table/insurance-fund-transactions-table';
import PageHeader from '@/components/page-header';
import TVL from '@/components/tvl';
import { useInsuranceFund } from '@/hooks/use-insurance-fund';
import { Trans } from '@/i18n';
import { Container, Grid, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function InsuranceFundView() {
  const { error, loading, insuranceFund, stakes, onStake, onUnstake } = useInsuranceFund();

  return (
    <Container maxWidth="xl">
      <PageHeader title={<Trans>Insurance</Trans>} subheader={<Trans>add description</Trans>} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TVL loading={loading} amount={insuranceFund.tvl} color={'success'} />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography variant="body1">
            <Trans>Description about the Insurance Fund</Trans>
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <InsurnaceFundPositionCard
            loading={loading}
            balance={insuranceFund.balance}
            currentYield={insuranceFund.currentYield}
            onStake={onStake}
            onUnstake={onUnstake}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <p>BOnding curve</p>
        </Grid>

        <Grid item xs={12} md={6}>
          <InsuranceFundTransactionsTable loading={loading} transactions={[...stakes]} />
        </Grid>

        <Grid item xs={12} md={6}>
          <InsuranceFundClaimsTable loading={loading} claims={[]} />
        </Grid>
      </Grid>
    </Container>
  );
}

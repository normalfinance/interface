'use client';

// @mui
import Container from '@mui/material/Container';

// hooks
import { useSynthMarkets } from '@/hooks/use-synth-markets';

// components
import { PageHeader, Trans, MarketGroup, MarketsTable } from '@normalfinance/ui';
import { Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function MarketsView() {
  const { markets } = useSynthMarkets();

  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Markets</Trans>}
        subheader={<Trans>Synthetic asset markets</Trans>}
      />

      <Grid xs={12} md={6} lg={6}>
        <MarketGroup title="New Markets" markets={[]} />
      </Grid>

      <Grid xs={12} md={6} lg={6}>
        <MarketGroup title="Top Gainer Markets" markets={[]} />
      </Grid>

      <MarketsTable markets={markets} />
    </Container>
  );
}

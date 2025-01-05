import { useState, useCallback } from 'react';

// mui
import PageHeader from '@/components/page-header';
import { Trans } from '@/i18n';
import { Alert, AlertTitle, Button, Container, Grid, Typography } from '@mui/material';
import LiquidityPositionItem from '@/components/liquidity-position-item';
import Iconify from '@/components/iconify';
import LiquidityPositionFilters from '@/components/liquidity-position-filters';
import { RouterLink } from '@/routes/components';
import { paths } from '@/routes/paths';
import TopPoolsByTVL from '@/components/top-pools-by-tvl';
import LiquidityPositions from '@/components/liquidity-positions';

// ----------------------------------------------------------------------

export default function LiquidityPositionsView() {
  const { positions } = useLPs();
  const { pools } = usePools();

  const table = useTable();

  return (
    <Container maxWidth="xl">
      {/* <PageHeader
        title={<Trans>Your positions</Trans>}
        subheader={<Trans>Liquidity you've provided to pools</Trans>}
      /> */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <LiquidityPositions positions={positions} />
        </Grid>

        <Grid item xs={12} md={4}>
          <TopPoolsByTVL pools={pools.slice(0, 10)} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Alert severity="info">
            <AlertTitle sx={{ textTransform: 'capitalize' }}>
              <Trans>Looking for your closed positions?</Trans>
            </AlertTitle>

            <Typography variant="body2">
              <Trans>You can see them by using the filter at the top of the page.</Trans>
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
}

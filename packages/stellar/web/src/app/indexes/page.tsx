import { Metadata } from 'next';

// @mui
import { Container, Stack, Typography } from '@mui/material';

// components
import { Trans } from '@normalfinance/ui';
import IndexesView from '@/sections/indexes';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Indexes',
};

export default function IndexesPage() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">
          <Trans>Indexes</Trans>
        </Typography>

        {/* <CreateIndexButtonWrapper /> */}
      </Stack>

      <IndexesView />
    </Container>
  );
}

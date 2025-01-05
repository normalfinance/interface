import CreateIndexButtonWrapper from '@/components/create-index-button-wrapper';
import { Trans } from '@/i18n';
import { Container, Stack, Typography } from '@mui/material';
import { Metadata } from 'next';
import IndexesView from '@/sections/indexes';
import { pageView } from '@/utils/analytics/server';
import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Indexes',
};

export default async function IndexesPage() {
  await pageView(paths.indexes);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">
          <Trans>Indexes</Trans>
        </Typography>

        <CreateIndexButtonWrapper />
      </Stack>

      <IndexesView />
    </Container>
  );
}

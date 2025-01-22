// @mui
import { Container, Grid } from '@mui/material';

// hooks
import { useIndexFactory } from '@/hooks/use-index-factory';

// components
import { Trans, PageHeader, CreateIndexForm } from '@normalfinance/ui';

// ----------------------------------------------------------------------

export default function CreateIndexView() {
  const { error, loading, onCreateIndex } = useIndexFactory();

  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Create an Index</Trans>}
        subheader={<Trans>Automate your crypto portfolio with a spin</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <CreateIndexForm error={error} loading={loading} onCreate={onCreateIndex} />
        </Grid>
      </Grid>
    </Container>
  );
}

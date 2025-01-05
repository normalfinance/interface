import PageHeader from '@/components/page-header';
import { Trans } from '@/i18n';
import { Container, Grid } from '@mui/material';
import CreateIndexForm from '@/components/create-index-form';

// ----------------------------------------------------------------------

export default function CreateIndexView() {
  return (
    <Container maxWidth="xl">
      <PageHeader
        title={<Trans>Create an Index</Trans>}
        subheader={<Trans>add description</Trans>}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <CreateIndexForm />
        </Grid>
      </Grid>
    </Container>
  );
}

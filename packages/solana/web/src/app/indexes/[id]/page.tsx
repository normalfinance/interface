// config
import { fetchIndex } from '@/server/actions/fetch-indexes';
import { Container } from '@mui/material';

// components
import IndexDetailsView from '@/sections/indexes/[id]';
import { notFound } from 'next/navigation';
import ErrorWithActions from '@/components/custom/error-with-actions';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Normal | Index Details',
};

export default async function IndexPage({ params }: { params: { id: string } }) {
  const { error, index } = await fetchIndex(Number(params.id));

  if (error != null)
    return (
      <Container maxWidth="lg">
        <ErrorWithActions title="Index error" error={error} />
      </Container>
    );

  if (index == null) return notFound();

  return (
    <Container maxWidth="lg">
      <IndexDetailsView index={index} />
    </Container>
  );
}

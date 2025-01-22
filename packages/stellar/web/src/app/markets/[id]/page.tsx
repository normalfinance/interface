// config
import { fetchIndex } from '@/server/actions/fetch-indexes';
import { Container } from '@mui/material';

// components
import IndexDetailsView from '@/sections/indexes/[id]';
import { notFound } from 'next/navigation';
import ErrorWithActions from '@/components/custom/error-with-actions';
import MarketByIdView from '@/sections/markets/byId';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Normal | Market - {enter}',
};

export default function Page({ params }: { params: { id: string } }) {
  // if (error != null)
  //   return (
  //     <Container maxWidth="lg">
  //       <ErrorWithActions title="Index error" error={error} />
  //     </Container>
  //   );

  // if (index == null) return notFound();

  return <MarketByIdView />;
}

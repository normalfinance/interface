import { Metadata } from 'next';
import CreateIndexView from '@/sections/create-index';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Normal | Create Index',
  description: '',
};

export default function Page() {
  return <CreateIndexView />;
}

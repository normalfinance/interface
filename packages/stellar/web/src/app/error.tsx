'use client';

import CompactLayout from '@/layouts/compact/layout';
import { View500 } from '@/sections/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <CompactLayout>
      <View500 error={error} />
    </CompactLayout>
  );
}

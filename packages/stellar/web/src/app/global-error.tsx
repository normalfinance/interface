'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { View500 } from '@/sections/error';
import CompactLayout from '@/layouts/compact/layout';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <CompactLayout>
          <View500 error={error} />
        </CompactLayout>
      </body>
    </html>
  );
}

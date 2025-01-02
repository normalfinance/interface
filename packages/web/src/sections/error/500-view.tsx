'use client';

import { m } from 'framer-motion';

// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// assets
// import { SeverErrorIllustration } from '@/assets/illustrations';
// components
// import { RouterLink } from '@/routes/components';
import { MotionContainer, varBounce } from '@/components/animate';
import { paths } from '@/routes/paths';
import { Trans } from '@/i18n';

// ----------------------------------------------------------------------

export default function Page500({ error }: { error: Error & { digest?: string } }) {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" paragraph>
          <Trans>500 Internal Server Error</Trans>
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          <Trans> There was an error, please try again later.</Trans>
        </Typography>
      </m.div>

      {/* <m.div variants={varBounce().in}>
        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
      </m.div> */}

      {error.name && <Typography sx={{ color: 'text.secondary' }}>{error.name}</Typography>}

      {error.message && <Typography sx={{ color: 'text.secondary' }}>{error.message}</Typography>}

      {/* <Button component={RouterLink} href={paths.home} size="large" variant="contained">
        <Trans>Go to Home</Trans>
      </Button> */}
    </MotionContainer>
  );
}

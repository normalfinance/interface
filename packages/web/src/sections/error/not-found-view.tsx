'use client';

import { m } from 'framer-motion';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// layouts
import CompactLayout from '@/layouts/compact';
// routes
// import { RouterLink } from '@/routes/components';
// components
import { MotionContainer, varBounce } from '@/components/animate';
// assets
// import { PageNotFoundIllustration } from '@/assets/illustrations';
import { paths } from '@/routes/paths';
import { Trans } from '@/i18n';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            <Trans>Sorry, Page Not Found!</Trans>
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            <Trans>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
              Be sure to check your spelling.
            </Trans>
          </Typography>
        </m.div>

        {/* <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div> */}

        {/* <Button component={RouterLink} href={paths.home} size="large" variant="contained">
          <Trans>Go to Home</Trans>
        </Button> */}
      </MotionContainer>
    </CompactLayout>
  );
}

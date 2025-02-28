import type { CardProps } from '@mui/material';
import type { BoxProps } from '@mui/material/Box';

import { CONFIG } from '@/global-config';
import { RouterLink } from '@/routes/components';
import { fShortenNumber } from '@/utils/format-number';
import { Label, labelClasses } from '@/components/label';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { MotionViewport } from 'src/components/animate';

import { FloatLine, FloatTriangleDownIcon } from './components/svg-elements';
import { SectionTitle } from './components/section-title';

// ----------------------------------------------------------------------

export function HomePOAP({ sx, ...other }: BoxProps) {
  const renderContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <SectionTitle
          title="Take the spirit of Normal with you everywhere you"
          txtGradient="go!"
          sx={{ mb: { xs: 5, md: 8, maxWidth: '767px' }, textAlign: 'center' }}
        />
      </Box>

      <PoapItem sx={{ maxWidth: '767px' }} />
    </Box>
  );

  return (
    <Box component="section" sx={sx} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        {topLines()}

        <Container>{renderContent()}</Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const topLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        position: 'absolute',
        transform: 'translateX(-50%)',
      }}
    >
      <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
      <FloatTriangleDownIcon
        sx={{
          width: 30,
          height: 15,
          opacity: 0.24,
          position: 'static',
        }}
      />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

// ----------------------------------------------------------------------

function PoapItem({ sx, ...other }: CardProps) {
  const renderImage = () => (
    <Box sx={{ px: 1, pt: 1 }}>
      <Image
        alt="Normal POAP QR Code"
        src={`${CONFIG.assetsDir}/assets/images/POAP-website-qr-code.jpeg`}
        sx={{ borderRadius: 1.5 }}
      />
    </Box>
  );

  const renderLabels = () => (
    <Box
      sx={{
        gap: 1,
        mb: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        [`& .${labelClasses.root}`]: { typography: 'caption', color: 'text.secondary' },
      }}
    >
      <Label startIcon={<Iconify width={12} icon="solar:clock-circle-outline" />}>
        6pm - 10pm MST (4hrs)
      </Label>

      <Label startIcon={<Iconify width={12} icon="solar:users-group-rounded-bold" />}>
        {fShortenNumber(100)}
      </Label>
    </Box>
  );

  const renderFooter = () => (
    <Box
      sx={{
        mt: 2.5,
        gap: 0.5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Button
        variant="contained"
        color="info"
        size="large"
        LinkComponent={RouterLink}
        href={CONFIG.poap_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Mint your POAP
      </Button>
    </Box>
  );

  return (
    <Card sx={[{ width: 1 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {renderImage()}

      <Box sx={{ px: 2, py: 2.5 }}>
        {renderLabels()}

        <Typography variant="subtitle2">
          Commemorate this moment by minting one of our exclusive 100 POAPs! Stare at it, or save it
          for later to use when Normal launches.
        </Typography>

        {renderFooter()}
      </Box>
    </Card>
  );
}

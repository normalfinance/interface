// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// components
import Label from '@/components/label';
import { Trans } from '@/i18n';
import { show } from '@/utils/crisp';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src="/logo/logo_single.png"
            alt="Normal Logo"
            sx={{ width: 48, height: 48, p: 0.35 }}
          />
          <Label
            className="rainbow-button"
            color="secondary"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            <Trans>Support</Trans>
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            <Trans>Need help?</Trans>
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            <Trans>We&apos;ve got you covered</Trans>
          </Typography>
        </Stack>

        <Button variant="contained" onClick={() => show()}>
          <Trans>Live chat</Trans>
        </Button>
      </Stack>
    </Stack>
  );
}

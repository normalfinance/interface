// @mui
import Box, { BoxProps } from '@mui/material/Box';
// hooks
import { useResponsive } from '@/hooks/use-responsive';
// components
import { useSettingsContext } from '@/providers/SettingsProvider';
//
import { HEADER, NAV } from '@normalfinance/utils';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavMini = settings.themeLayout === 'mini';

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 2,
          pt: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

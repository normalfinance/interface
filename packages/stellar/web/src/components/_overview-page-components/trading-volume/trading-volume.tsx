import type { CardProps } from '@mui/material/Card';

import { varAlpha } from 'minimal-shared/utils';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fPercent, fShortenNumber } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';

type Props = CardProps & {
  title: string;
  total: number;
  percent: number;
  // Remove the chart prop entirely
};

export function TradingVolume({ title, percent, total, sx, ...other }: Props) {
  const theme = useTheme();

  const renderTrending = () => (
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
      <Box
        component="span"
        sx={{
          width: 24,
          height: 24,
          display: 'flex',
          borderRadius: '50%',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: varAlpha(theme.vars.palette.success.mainChannel, 0.16),
          color: 'success.dark',
          ...theme.applyStyles('dark', {
            color: 'success.light',
          }),
          ...(percent < 0 && {
            bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
            color: 'error.dark',
            ...theme.applyStyles('dark', {
              color: 'error.light',
            }),
          }),
        }}
      >
        <Iconify
          width={16}
          icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        />
      </Box>

      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>

      <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
        last week
      </Box>
    </Box>
  );

  return (
    <Card
      sx={[{ p: 3, display: 'flex', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'subtitle2' }}>{title}</Box>

        <Box sx={{ my: 1.5, typography: 'h3' }}>{fShortenNumber(total)}</Box>

        {renderTrending()}
      </Box>
      {/* Chart removed */}
    </Card>
  );
}

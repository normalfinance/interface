'use client';

import { m } from 'framer-motion';
// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// components
import { varHover } from '@/components/template/animate';
import { useSettingsContext } from '@/providers/SettingsProvider';
import SvgColor from '@/components/template/svg-color';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function SettingsButton({ sx }: Props) {
  const settings = useSettingsContext();

  return (
    <Box component={m.div}>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        aria-label="settings"
        onClick={() =>
          settings.onUpdate('themeMode', settings.themeMode === 'dark' ? 'light' : 'dark')
        }
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <SvgColor
          src={`/assets/icons/setting/ic_${settings.themeMode === 'light' ? 'moon' : 'sun'}.svg`}
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>
    </Box>
  );
}

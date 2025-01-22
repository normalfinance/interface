'use client';

import merge from 'lodash/merge';
import { useMemo } from 'react';
// @mui
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
// locales
import i18n from 'i18next';
// components
import { useSettingsContext } from '@/providers/SettingsProvider';
// system
import { palette } from '../theme/palette';
import { shadows } from '../theme/shadows';
import { typography } from '../theme/typography';
import { customShadows } from '../theme/custom-shadows';
import { componentsOverrides } from '../theme/overrides';
// options
import { darkMode } from '../theme/options/dark-mode';
import RTL, { direction } from '../theme/options/right-to-left';

// ----------------------------------------------------------------------


type Props = {
  children: React.ReactNode;
};

export default function NormalThemeProvider({ children }: Props) {
  const settings = useSettingsContext();

  const darkModeOption = darkMode(settings.themeMode);

  const directionOption = direction(settings.themeDirection);

  const baseOption = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      typography,
      shape: { borderRadius: 8 },
    }),

    []
  );

  const memoizedValue = useMemo(
    () =>
      merge(
        // Base
        baseOption,
        // Direction: remove if not in use
        directionOption,
        // Dark mode: remove if not in use
        darkModeOption
      ),
    [baseOption, directionOption, darkModeOption]
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  theme.components = componentsOverrides(theme);

  const themeWithLocale = useMemo(
    () =>
      createTheme(theme, {
        lang: i18n.language,
      }),
    [theme]
  );

  return (
    <MuiThemeProvider theme={themeWithLocale}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  );
}

export default NormalThemeProvider;

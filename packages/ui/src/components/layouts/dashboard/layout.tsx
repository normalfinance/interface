/* eslint-disable @typescript-eslint/no-shadow */

'use client';

// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from '@/hooks';
import { useResponsive } from '@/hooks/use-responsive';

// components
import { useSettingsContext } from '@/providers/SettingsProvider';
import NavVertical from './nav-vertical';
import NavMini from './nav-mini';
import Header from './header';
import Main from './main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  walletPopover: React.ReactNode;
  footer: React.ReactNode;
};

export default function DashboardLayout({ children, walletPopover, footer }: Props) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} walletPopover={walletPopover} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} walletPopover={walletPopover} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>
          {children}
          {footer}
        </Main>
      </Box>
    </>
  );
}

'use client';

import { Wallet } from '@solana/wallet-adapter-react';
import type { IconButtonProps } from '@mui/material/IconButton';

import { useWallet } from '@/hooks';
import { useModalStore } from '@/stores';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UpgradeBlock } from './nav-upgrade';
import ConnectButton from '@/components/connect-button';

// ----------------------------------------------------------------------

export type ConnectWalletDrawerProps = IconButtonProps & {};

export function ConnectWalletDrawer({ sx, ...other }: ConnectWalletDrawerProps) {
  const setModalStore = useModalStore((s) => s.set);
  const walletContext = useWallet();

  const handleOnClose = () => {
    setModalStore((s) => {
      s.modals.showConnectWalletModal = false;
    });
  };

  const handleConnectWallet = (wallet: Wallet) => {
    walletContext.select(wallet.adapter.name);
    wallet.adapter.connect();
  };

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      {walletContext?.wallets?.length > 0
        ? walletContext?.wallets?.map((wallet, index) => (
            <WalletOption
              key={wallet.adapter.name.toString()}
              wallet={wallet}
              onClick={() => handleConnectWallet(wallet)}
              index={index}
            />
          ))
        : 'No Solana wallets found.'}
    </MenuList>
  );

  return (
    <>
      <ConnectButton sx={sx} {...other} />

      <Drawer
        open={s.modals.showConnectWalletModal}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              Connect wallet
            </Typography>
          </Box>

          {renderList()}

          <Box sx={{ px: 2.5, py: 3 }}>
            <UpgradeBlock />
          </Box>
        </Scrollbar>
      </Drawer>
    </>
  );
}

const WalletOption = ({
  onClick,
  wallet,
  index,
}: {
  onClick: () => void;
  wallet: Wallet;
  index: number;
}) => {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        p: 1,
        width: 1,
        display: 'flex',
        typography: 'body2',
        alignItems: 'center',
        color: 'text.secondary',
        '& svg': { width: 24, height: 24 },
        '&:hover': { color: 'text.primary' },
      }}
    >
      {wallet.adapter.icon}

      {/* <Image
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
          width={24}
          height={24}
        /> */}

      <Box component="span" sx={{ ml: 2 }}>
        {wallet.adapter.name}
      </Box>

      {/* {option.info && (
                <Label color="error" sx={{ ml: 1 }}>
                  {option.info}
                </Label>
              )} */}

      <div>
        {wallet.adapter.connected
          ? 'Connected'
          : wallet.adapter.readyState === 'Installed'
            ? 'Detected'
            : ''}
      </div>
    </MenuItem>
  );
};

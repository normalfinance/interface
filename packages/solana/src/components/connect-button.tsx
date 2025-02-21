'use client';

import { useCommonNormalStore, useModalStore } from '@/stores';
import { Button, ButtonProps } from '@mui/material';
import { Iconify } from './iconify';
import { COMMON_UI_UTILS } from '@/utils/common-ui-utils/commonUiUtils';

export default function ConnectButton({ sx, ...other }: ButtonProps) {
  const authority = useCommonNormalStore((s) => s.authority);

  const setModalStore = useModalStore((s) => s.set);

  const openConnectWalletModal = () => {
    setModalStore((s) => {
      s.modals.showConnectWalletModal = true;
    });
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={openConnectWalletModal}
      sx={sx}
      {...other}
    >
      {!authority && (
        <>
          <span>Connect to</span>

          <Iconify width={24} icon="solar:wallet-bold" />
        </>
      )}

      {authority && <span>{COMMON_UI_UTILS.abbreviateAddress(authority)}</span>}
    </Button>
  );
}

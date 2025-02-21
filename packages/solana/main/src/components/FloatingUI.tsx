'use client';

import React from 'react';

import { useModalStore } from '@/stores/useModalStore';
import { ConnectWalletDrawer } from '@/layouts/components/connect-wallet-drawer';

function FloatingUI() {
  const { showConnectWalletModal } = useModalStore((s) => s.modals);

  return <>{showConnectWalletModal ? <ConnectWalletDrawer /> : <></>}</>;
}

export default React.memo(FloatingUI);

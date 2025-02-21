import { useContext } from 'react';
import { useCommonNormalStore } from '../stores';
import { NormalWalletContext } from '../providers';

export const useWalletContext = () => {
  const walletContextState = useCommonNormalStore((s) => s.currentlyConnectedWalletContext);

  return walletContextState;
};

export const useWallet = () => {
  const normalWalletContext = useContext(NormalWalletContext);

  return normalWalletContext;
};

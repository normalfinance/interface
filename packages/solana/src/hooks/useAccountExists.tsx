import { useEffect, useState } from 'react';
import { useNormalClientIsReady } from './useNormalClientIsReady';
import { singletonHook } from 'react-singleton-hook';
import { useCommonNormalStore } from '../stores';
import { useWalletContext } from './useWalletContext';

/**
 * Checks if the current user has a Normal account.
 */
export const useAccountExists = () => {
  const normalClientIsReady = useNormalClientIsReady();
  const normalClient = useCommonNormalStore((s) => s.normalClient.client);
  const walletState = useWalletContext();
  const userAccountNotInitialized = useCommonNormalStore((s) => s.userAccountNotInitialized);
  const [accountExists, setAccountExists] = useState<boolean>();

  const getAndSetUserExists = async () => {
    if (!normalClient || !walletState?.wallet?.adapter?.publicKey) return;

    const subAccounts = await normalClient.getUserAccountsForAuthority(
      walletState?.wallet?.adapter?.publicKey
    );

    try {
      const user = normalClient.getUser(
        subAccounts[0]?.subAccountId,
        walletState?.wallet?.adapter?.publicKey
      );
      const userAccountExists = await user.exists();
      setAccountExists(userAccountExists);
    } catch (e) {
      setAccountExists(false);
    }
  };

  useEffect(() => {
    if (!walletState?.connected || !normalClientIsReady) return;
    getAndSetUserExists();
  }, [walletState, normalClientIsReady, userAccountNotInitialized]);

  return accountExists;
};

export default singletonHook(false, useAccountExists);

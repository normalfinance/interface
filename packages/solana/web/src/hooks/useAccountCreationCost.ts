import { BASE_PRECISION_EXP, BigNum, calculateInitUserFee } from '@normalfinance/solana-sdk';
import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import { useCommonNormalStore } from '../stores';
import { useNormalClientIsReady } from './useNormalClientIsReady';
import { NEW_ACCOUNT_BASE_COST } from '@/constants/misc';

const _useAccountCreationCost = () => {
  const normalClient = useCommonNormalStore((s) => s.normalClient.client);
  const normalClientIsReady = useNormalClientIsReady();
  const [loaded, setLoaded] = useState(false);
  const [cost, setCost] = useState(NEW_ACCOUNT_BASE_COST);

  useEffect(() => {
    if (normalClient && normalClientIsReady) {
      const stateAccount = normalClient.getStateAccount();
      const fee = calculateInitUserFee(stateAccount);

      const newCost = NEW_ACCOUNT_BASE_COST.add(BigNum.from(fee, BASE_PRECISION_EXP));

      setCost(newCost);
      setLoaded(true);
    }
  }, [normalClient, normalClientIsReady]);

  return {
    accountCreationCost: cost,
    accountCreationCostLoaded: loaded,
  };
};

/**
 * Cost of subaccount creation. Includes both base rent, donation (if any), and account creation rent.
 */
export const useAccountCreationCost = singletonHook(
  {
    accountCreationCost: NEW_ACCOUNT_BASE_COST,
    accountCreationCostLoaded: false,
  },
  _useAccountCreationCost
);

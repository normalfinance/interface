'use client';

import { useCallback, useState, useEffect } from 'react';

import { NormalStakingContract } from '@normalfinance/stellar-contracts';
import { constants } from '@normalfinance/utils';
import { useContractTransaction } from './use-contract-transaction';
import { usePersistStore } from '@/state/store';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  staking: Staking;
  onLock: (amount: number) => void;
  onUnlock: (stake_amount: number, stake_ts: number) => void;
  onWithdrawRewards: () => void;
}

// ----------------------------------------------------------------------

export function useNormStaking(): ReturnType {
  // Load App Store
  //   const store = useAppStore();
  const storePersist = usePersistStore();

  const { executeContractTransaction } = useContractTransaction();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [normStaking, setNormStaking] = useState<Staking>(); // State to hold norm staking data

  const fetchStaking = useCallback(async () => {
    const StakingContract = new NormalStakingContract.Client({
      contractId: constants.NORM_STAKING_ADDRESS,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    const staking = await StakingContract.query_config();

    setNormStaking(staking as Staking);
    setLoading(false);
  }, []);

  const onLock = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'norm_staking',
      contractAddress: constants.NORM_STAKING_ADDRESS,
      transactionFunction: async (client, restore) => {
        return client.lock(
          {
            sender: storePersist.wallet.address!,
            amount: BigInt((amount * 10 ** (index?.decimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onUnlock = useCallback(async (stake_amount: number, stake_ts: number) => {
    await executeContractTransaction({
      contractType: 'norm_staking',
      contractAddress: constants.NORM_STAKING_ADDRESS,
      transactionFunction: async (client, restore) => {
        return client.unlock(
          {
            sender: storePersist.wallet.address!,
            stake_amount: BigInt((stake_amount * 10 ** (index?.decimals || 7)).toFixed(0)),
            stake_ts,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onWithdrawRewards = useCallback(async () => {
    await executeContractTransaction({
      contractType: 'norm_staking',
      contractAddress: constants.NORM_STAKING_ADDRESS,
      transactionFunction: async (client, restore) => {
        return client.withdraw_rewards(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  // On component mount, fetch staking
  useEffect(() => {
    fetchStaking();
  }, [fetchStaking]);

  return {
    error,
    loading,
    staking: normStaking,
    onLock,
    onUnlock,
    onWithdrawRewards,
  };
}

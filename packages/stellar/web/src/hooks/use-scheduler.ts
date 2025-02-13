'use client';

import { useCallback, useState, useEffect } from 'react';

import { NormalSchedulerContract } from '@normalfinance/stellar-contracts';
import { constants } from '@normalfinance/utils';
import { useContractTransaction } from './use-contract-transaction';
import { usePersistStore } from '@/state/store';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  scheduler: Scheduler;
  onDeposit: (asset: string, amount: number) => void;
  // onWithdraw: (asset: string, amount: number) => void;
  // onCreateSchedule: (params: ScheduleParams) => void;
  // onDeleteSchedule: (schedule_timestamp: number) => void;
}

// ----------------------------------------------------------------------

export function useScheduler(): ReturnType {
  // Load App Store
  //   const store = useAppStore();
  const storePersist = usePersistStore();

  const { executeContractTransaction } = useContractTransaction();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [scheduler, setScheduler] = useState<Scheduler>(); // State to hold index data

  const fetchScheduler = useCallback(async () => {
    const SchedulerContract = new NormalSchedulerContract.Client({
      contractId: constants.SCHEDULER_ADDRESS,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    const config = await SchedulerContract.query_config();

    setScheduler(config as Scheduler);
    setLoading(false);
  }, []);

  const onDeposit = useCallback(async (asset: string, amount: number) => {
    await executeContractTransaction({
      contractType: 'scheduler',
      contractAddress: scheduler.schedulerAddress,
      transactionFunction: async (client, restore) => {
        return client.deposit(
          {
            sender: storePersist.wallet.address!,
            asset,
            amount: BigInt((amount * 10 ** (index?.decimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  // On component mount, fetch scheduler
  useEffect(() => {
    fetchScheduler();
  }, [fetchScheduler]);

  return {
    error,
    loading,
    scheduler,
    onDeposit,
    // ...
  };
}

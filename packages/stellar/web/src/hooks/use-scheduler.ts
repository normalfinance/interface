'use client';

import { useCallback, useState } from 'react';
import { useContractTransaction } from './use-contract-transaction';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  scheduler: Scheduler;
  schedules: Schedule[];
  onCreateAssetSchedule: () => void;
  onCreateIndexSchedule: () => void;
  onModifySchedule: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onDeleteSchedule: () => void;
}

// ----------------------------------------------------------------------

export function useScheduler(): ReturnType {
  const { executeContractTransaction } = useContractTransaction();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [scheduler, setScheduler] = useState<Scheduler>(); // State to hold pool data
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const fetchScheduler = useCallback(async () => {
    const InsuranceFundContract = new NormalInsuranceFundContract.Client({
      contractId: constants.FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const fund = await InsuranceFundContract.query_pools({});

    setInsuranceFund(fund as Pool[]);
    setLoading(false);
  }, []);

  const onCreateAssetSchedule = useCallback(() => {
    alert('Create asset schedule');
  }, []);

  const onCreateIndexSchedule = useCallback(() => {
    alert('Create index schedule');
  }, []);

  const onModifySchedule = useCallback(() => {
    alert('Modify');
  }, []);

  const onDeposit = useCallback(async (): Promise<void> => {
    try {
      // Execute the transaction using the hook
      await executeContractTransaction({
        contractType: 'multihop',
        contractAddress: constants.MULTIHOP_ADDRESS,
        transactionFunction: async (client, restore) => {
          return client.swap(
            {
              recipient: storePersist.wallet.address!,
              operations,
              amount: BigInt(tokenAmounts[0] * 10 ** 7),
              max_spread_bps: BigInt(maxSpread * 100),
              deadline: undefined,
              pool_type: 0,
              max_allowed_fee_bps: undefined,
            },
            { simulate: !restore }
          );
        },
      });

      // Wait for the next block and fetch token balances
      setTimeout(async () => {
        await appStore.fetchTokenInfo(fromToken?.name!);
        await appStore.fetchTokenInfo(toToken?.name!);
      }, 7000);
    } catch (error) {
      console.log('Error during swap transaction', error);
    }
  }, [
    appStore,
    fromToken?.name,
    maxSpread,
    operations,
    storePersist,
    toToken?.name,
    tokenAmounts,
    executeContractTransaction,
  ]);

  const onWithdraw = useCallback(() => {
    alert('Withdraw');
  }, []);

  const onDeleteSchedule = useCallback(() => {
    alert('Delete');
  }, []);

  // On component mount, fetch scheduler and schedules
  useEffect(() => {
    fetchScheduler();
    fetchSchedules();
  }, [fetchScheduler, fetchSchedules]);

  return {
    error,
    loading,
    scheduler,
    schedules,
    onCreateAssetSchedule,
    onCreateIndexSchedule,
    onModifySchedule,
    onDeposit,
    onWithdraw,
    onDeleteSchedule,
  };
}

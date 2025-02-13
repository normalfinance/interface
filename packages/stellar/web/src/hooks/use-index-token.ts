'use client';

import { useCallback, useState, useEffect } from 'react';

import { NormalIndexTokenContract } from '@normalfinance/stellar-contracts';
import { constants } from '@normalfinance/utils';
import { useContractTransaction } from './use-contract-transaction';
import { usePersistStore } from '@/state/store';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  index: Index;
  onUpdateManagerFee: (manager_fee: number) => void;
  onUpdatePausedOperations: (to_add: number[], to_remove: number[]) => void;
  onUpdateWhitelist: (to_add: number[], to_remove: number[]) => void;
  onUpdateBlacklist: (to_add: number[], to_remove: number[]) => void;
  onUpdateRebalanceThreshold: (rebalance_threshold: number) => void;
  onMint: (amount: number) => void;
  onRedeem: (amount: number) => void;
  onCollectFees: () => void;
  onRebalance: (updated_assets: any[]) => void;
}

// ----------------------------------------------------------------------

export function useIndexToken(indexAddress: string): ReturnType {
  // Load App Store
  //   const store = useAppStore();
  const storePersist = usePersistStore();

  const { executeContractTransaction } = useContractTransaction();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [index, setIndex] = useState<Index>(); // State to hold index data

  const fetchIndex = useCallback(async (indexAddress: string) => {
    const IndexTokenContract = new NormalIndexTokenContract.Client({
      contractId: indexAddress,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    const [indexConfig, indexInfo] = await Promise.all([
      IndexTokenContract.query_config(),
      IndexTokenContract.query_index_info(),
    ]);

    setIndex(indexInfo as Index[]);
    setLoading(false);
  }, []);

  const onUpdateManagerFee = useCallback(async (manager_fee: number) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.update_manager_fee(
          {
            sender: storePersist.wallet.address!,
            manager_fee_bps: 0,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onUpdatePausedOperations = useCallback(async (to_add: number[], to_remove: number[]) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.update_paused_operations(
          {
            sender: storePersist.wallet.address!,
            to_add,
            to_remove,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onUpdateWhitelist = useCallback(async (to_add: number[], to_remove: number[]) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.update_whitelist(
          {
            sender: storePersist.wallet.address!,
            to_add,
            to_remove,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onUpdateBlacklist = useCallback(async (to_add: number[], to_remove: number[]) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.update_blacklist(
          {
            sender: storePersist.wallet.address!,
            to_add,
            to_remove,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onUpdateRebalanceThreshold = useCallback(async (rebalance_threshold: number) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.update_rebalance_threshold(
          {
            sender: storePersist.wallet.address!,
            rebalance_threshold,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onMint = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.mint(
          {
            sender: storePersist.wallet.address!,
            index_token_amount: BigInt((amount * 10 ** (index?.decimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onRedeem = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.redeem(
          {
            sender: storePersist.wallet.address!,
            index_token_amount: BigInt((amount * 10 ** (index?.decimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onCollectFees = useCallback(async () => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.collect_fees(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onRebalance = useCallback(async (updated_assets: any[]) => {
    await executeContractTransaction({
      contractType: 'index',
      contractAddress: index.indexAddress,
      transactionFunction: async (client, restore) => {
        return client.rebalance(
          {
            sender: storePersist.wallet.address!,
            updated_assets,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  // On component mount, fetch index
  useEffect(() => {
    fetchIndex(indexAddress);
  }, [fetchIndex]);

  return {
    error,
    loading,
    index,
    onUpdateManagerFee,
    onUpdatePausedOperations,
    onUpdateWhitelist,
    onUpdateBlacklist,
    onUpdateRebalanceThreshold,
    onMint,
    onRedeem,
    onCollectFees,
    onRebalance,
  };
}

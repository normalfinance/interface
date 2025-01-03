'use client';

import { useCallback, useState, useEffect } from 'react';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  index: Index;
  onModify: () => void;
  onMint: () => void;
  onRedeem: () => void;
  onCollectFees: () => void;
  onRebalance: () => void;
}

// ----------------------------------------------------------------------

export function useIndex(indexId: number): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [index, setIndex] = useState<Index[]>([]); // State to hold pool data

  const fetchIndex = useCallback(async (indexId: number) => {
    const InsuranceFundContract = new NormalInsuranceFundContract.Client({
      contractId: constants.FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const fund = await InsuranceFundContract.query_pools({});

    setInsuranceFund(fund as Pool[]);
    setLoading(false);
  }, []);

  const onModify = useCallback(() => {
    alert('Modify');
  }, []);

  const onMint = useCallback(() => {
    alert('Mint');
  }, []);

  const onRedeem = useCallback(() => {
    alert('Redeem');
  }, []);

  const onCollectFees = useCallback(() => {
    alert('CollectFees');
  }, []);

  const onRebalance = useCallback(() => {
    alert('Rebalance');
  }, []);

  // On component mount, fetch index
  useEffect(() => {
    fetchIndex(indexId);
  }, [fetchIndex]);

  return {
    error,
    loading,
    index,
    onModify,
    onMint,
    onRedeem,
    onCollectFees,
    onRebalance,
  };
}

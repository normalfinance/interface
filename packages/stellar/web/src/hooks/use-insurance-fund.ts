'use client';

import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  insuranceFund: InsuranceFund;
  stakes: InsuranceFundStake[];
  onStake: () => void;
  onUnstake: () => void;
}

// ----------------------------------------------------------------------

export function useInsuranceFund(): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [insuranceFund, setInsuranceFund] = useState<Pool[]>([]); // State to hold pool data
  const [insuranceFundStakes, setInsuranceFundStakes] = useState<Pool[]>([]);

  const fetchInsuranceFund = useCallback(async () => {
    const InsuranceFundContract = new NormalInsuranceFundContract.Client({
      contractId: constants.FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const fund = await InsuranceFundContract.query_pools({});

    setInsuranceFund(fund as Pool[]);
    setLoading(false);
  }, []);

  const onStake = useCallback(() => {
    alert('Stake');
  }, []);

  const onUnstake = useCallback(() => {
    alert('Unstake');
  }, []);

  // On component mount, fetch IF
  useEffect(() => {
    fetchInsuranceFund();
  }, [fetchInsuranceFund]);

  return {
    error,
    loading,
    insuranceFund,
    stakes: insuranceFundStakes,
    onStake,
    onUnstake,
  };
}

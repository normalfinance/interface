'use client';

import { useCallback, useState, useEffect } from 'react';

import { NormalGovernorContract } from '@normalfinance/stellar-contracts';
import { constants } from '@normalfinance/utils';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  governor: Governor;
}

// ----------------------------------------------------------------------

export function useGovernor(): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [governor, setGovernor] = useState<Governor>(); // State to hold governor data

  const fetchInsurance = useCallback(async () => {
    const GovernorContract = new NormalGovernorContract.Client({
      contractId: constants.GOVERNOR_ADDRESS,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    setGovernor(GovernorContract as Governor);
    setLoading(false);
  }, []);

  // On component mount, fetch governor
  useEffect(() => {
    fetchInsurance();
  }, [fetchInsurance]);

  return {
    error,
    loading,
    governor,
  };
}

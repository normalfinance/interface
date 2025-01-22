'use client';

import { useCallback, useState, useEffect } from 'react';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  factory: IndexFactory;
  fetchFactory: () => void;
  onCreateIndex: (x: any) => void; // TODO: replace with args type
}

// ----------------------------------------------------------------------

export function useIndexFactory(): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [factory, setFactory] = useState<IndexFactory[]>([]); // State to hold pool data

  const fetchFactory = useCallback(async () => {
    const FactoryContract = new NormalIndexFactoryContract.Client({
      contractId: constants.FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const fund = await FactoryContract.query_pools({});

    setFactory(fund as IndexFactory[]);
    setLoading(false);
  }, []);

  const onCreateIndex = useCallback((x: any) => {
    alert('Create index');
  }, []);

  // On component mount, fetch index
  useEffect(() => {
    fetchFactory();
  }, [fetchFactory]);

  return {
    error,
    loading,
    factory,
    fetchFactory,
    onCreateIndex,
  };
}

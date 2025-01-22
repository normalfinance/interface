'use client';

import { useCallback, useState } from 'react';

import { Proposal } from '@normalfinance/types';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  proposals: Proposal[];
  getProposals: () => void;
  getProposalById: (id: number) => Proposal;
  onVote: (proposalId: number, vote: boolean) => void;
}

// ----------------------------------------------------------------------

export function useGovernance(): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [proposals, setProposals] = useState<Proposal[]>([]); // State to hold pool data

  const getProposals = useCallback(async () => {
    const GovernorContract = new NormalGovernorContract.Client({
      contractId: constants.FACTORY_ADDRESS,
      networkPassphrase: constants.NETWORK_PASSPHRASE,
      rpcUrl: constants.RPC_URL,
    });

    const proposals = await GovernorContract.query_proposals({});

    setProposals(proposals as Proposal[]);
    setLoading(false);
  }, []);

  const onVote = useCallback((proposalId: number, vote: boolean) => {
    alert('Vote');
  }, []);

  const getProposalById = useCallback((proposalId: number, vote: boolean) => {
    alert('Vote');
  }, []);

  return {
    error,
    loading,
    proposals,
    getProposals,
    getProposalById,
    onVote,
  };
}

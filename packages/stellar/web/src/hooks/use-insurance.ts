'use client';

import { usePersistStore } from '@/state/store';
import { constants } from '@normalfinance/utils';
import { useState, useEffect, useCallback } from 'react';
import { NormalInsuranceContract } from '@normalfinance/stellar-contracts';

import { useContractTransaction } from './use-contract-transaction';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  insuranceFund: any; // TODO: replace with InsuranceFund
  buffer: any; // TODO: replace with Buffer
  onAddStake: (amount: number) => void;
  onRequestRemoveStake: (amount: number) => void;
  onCancelRequestRemoveStake: () => void;
  onRemoveStake: () => void;
}

// ----------------------------------------------------------------------

export function useInsurance(): ReturnType {
  // Load App Store
  //   const store = useAppStore();
  const storePersist = usePersistStore();

  const { executeContractTransaction } = useContractTransaction();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [insuranceFund, setInsuranceFund] = useState<any>(); // State to hold if data
  const [buffer, setBuffer] = useState<any>(); // State to hold buffer data

  const tokenDecimals = 13; // TODO: does this need to be added to the if?

  const fetchInsurance = useCallback(async () => {
    const InsuranceContract = new NormalInsuranceContract.Client({
      contractId: constants.INSURANCE_ADDRESS,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    const insurance_fund = await InsuranceContract.query_insurance_fund();

    setInsuranceFund(insurance_fund as any);
    setLoading(false);
  }, []);

  const onAddStake = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) =>
        client.add_if_stake(
          {
            sender: storePersist.wallet.address!,
            amount: BigInt((amount * 10 ** (tokenDecimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        ),
    });
  }, []);

  const onRequestRemoveStake = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) =>
        client.request_remove_if_stake(
          {
            sender: storePersist.wallet.address!,
            amount: BigInt((amount * 10 ** (tokenDecimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        ),
    });
  }, []);

  const onCancelRequestRemoveStake = useCallback(async () => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) =>
        client.cancel_request_remove_if_stake(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        ),
    });
  }, []);

  const onRemoveStake = useCallback(async () => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) =>
        client.remove_if_stake(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        ),
    });
  }, []);

  // On component mount, fetch insurnace
  useEffect(() => {
    fetchInsurance();
  }, [fetchInsurance]);

  return {
    error,
    loading,
    insuranceFund,
    buffer,
    onAddStake,
    onRequestRemoveStake,
    onCancelRequestRemoveStake,
    onRemoveStake,
  };
}

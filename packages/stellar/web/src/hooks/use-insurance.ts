'use client';

import { useCallback, useState, useEffect } from 'react';

import { NormalInsuranceContract } from '@normalfinance/stellar-contracts';
import { constants } from '@normalfinance/utils';
import { useContractTransaction } from './use-contract-transaction';
import { usePersistStore } from '@/state/store';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  insuranceFund: InsuranceFund;
  buffer: Buffer;
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
  const [insuranceFund, setInsuranceFund] = useState<InsuranceFund>(); // State to hold if data
  const [buffer, setBuffer] = useState<Bufer>(); // State to hold buffer data

  const fetchInsurance = useCallback(async () => {
    const InsuranceContract = new NormalInsuranceContract.Client({
      contractId: constants.INSURANCE_ADDRESS,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    const insurance_fund = await InsuranceContract.query_insurance_fund();

    setInsuranceFund(insurance_fund as Scheduler);
    setLoading(false);
  }, []);

  const onAddStake = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) => {
        return client.add_if_stake(
          {
            sender: storePersist.wallet.address!,
            amount: BigInt((amount * 10 ** (index?.decimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onRequestRemoveStake = useCallback(async (amount: number) => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) => {
        return client.request_remove_if_stake(
          {
            sender: storePersist.wallet.address!,
            amount: BigInt((amount * 10 ** (index?.decimals || 7)).toFixed(0)),
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onCancelRequestRemoveStake = useCallback(async () => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) => {
        return client.cancel_request_remove_if_stake(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        );
      },
    });
  }, []);

  const onRemoveStake = useCallback(async () => {
    await executeContractTransaction({
      contractType: 'insurance',
      contractAddress: insuranceFund.insuranceAddress,
      transactionFunction: async (client, restore) => {
        return client.remove_if_stake(
          {
            sender: storePersist.wallet.address!,
          },
          { simulate: !restore }
        );
      },
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

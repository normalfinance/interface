'use client';

import { useCallback, useState, useEffect } from 'react';
import { Token } from '@normalfinance/types';

import {
  checkTrustline,
  constants,
  fetchAndIssueTrustline,
  fetchTokenPrices,
  findBestPath,
  resolveContractError,
  Signer,
  WalletConnect,
} from '@normalfinance/utils';
import { useContractTransaction } from './use-contract-transaction';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  tokenA: Token | undefined;
  tokenB: Token | undefined;
  onSwap: () => void;
}

// ----------------------------------------------------------------------

export function useSwap(): ReturnType {
  const { executeContractTransaction } = useContractTransaction();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations

  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenA, setTokenA] = useState<Token | undefined>(undefined);
  const [tokenB, setTokenB] = useState<Token | undefined>(undefined);

  const [txBroadcasting, setTxBroadcasting] = useState<boolean>(false);

  const onSwap = useCallback(async (): Promise<void> => {
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
        await appStore.fetchTokenInfo(tokenA?.name!);
        await appStore.fetchTokenInfo(tokenB?.name!);
      }, 7000);
    } catch (error) {
      console.log('Error during swap transaction', error);
    }
  }, [
    appStore,
    tokenA?.name,
    maxSpread,
    operations,
    storePersist,
    tokenB?.name,
    tokenAmounts,
    executeContractTransaction,
  ]);

  /**
   * Simulates the swap transaction to determine the exchange rate and network fee.
   *
   * @async
   */
  const onSimulateSwap = useCallback(async (): Promise<void> => {
    if (fromToken && toToken) {
      if (tokenAmounts[0] === 0) {
        setTokenAmounts([0, 0]);
        setExchangeRate('');
        setNetworkFee('');
        return;
      }

      setLoadingSimulate(true);
      try {
        const contract = new PhoenixMultihopContract.Client({
          contractId: constants.MULTIHOP_ADDRESS,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        const tx = await contract.simulate_swap({
          operations,
          amount: BigInt(tokenAmounts[0] * 10 ** 7),
          pool_type: 0,
        });

        if (tx.result.ask_amount && tx.result.commission_amounts) {
          const _exchangeRate =
            (Number(tx.result.ask_amount) - Number(tx.result.commission_amounts[0][1])) /
            Number(tokenAmounts[0]);

          setExchangeRate(
            `${(_exchangeRate / 10 ** 7).toFixed(2)} ${toToken?.name} per ${fromToken?.name}`
          );
          setNetworkFee(
            `${Number(tx.result.commission_amounts[0][1]) / 10 ** 7} ${fromToken?.name}`
          );

          setTokenAmounts((prevAmounts) => {
            const newToTokenAmount = Number(tx.result.ask_amount) / 10 ** 7;
            return [prevAmounts[0], newToTokenAmount];
          });
        }
      } catch (e) {
        console.log(e);
      }
      setLoadingSimulate(false);
    }
  }, [fromToken?.name, toToken, fromAmount, operations, tokenAmounts]);

  const onTokenClick = useCallback(
    (token: Token): void => {
      if (isFrom) {
        setTokens(
          (tokens) =>
            [...tokens.filter((el) => el.name !== token.name), tokenA].filter(Boolean) as Token[]
        );
        setTokenA(token);
      } else {
        setTokens(
          (tokens) =>
            [...tokens.filter((el) => el.name !== token.name), tokenB].filter(Boolean) as Token[]
        );
        setTokenB(token);
      }
      setAssetSelectorOpen(false);
    },
    [tokenA, isFrom, tokenB]
  );

  const handleSelectorOpen = useCallback((isFromToken: boolean): void => {
    setAssetSelectorOpen(true);
    setIsFrom(isFromToken);
  }, []);

  // Effect hook to fetch all tokens once the component mounts
  useEffect(() => {
    const getAllTokens = async (): Promise<void> => {
      setLoading(true);
      const allTokens = await appStore.getAllTokens();
      setTokens(allTokens.slice(2));
      setTokenA(allTokens[0]);
      setTokenB(allTokens[1]);
      setLoading(false);

      // Get all pools
      const factoryContract = new PhoenixFactoryContract.Client({
        contractId: constants.FACTORY_ADDRESS,
        networkPassphrase: constants.NETWORK_PASSPHRASE,
        rpcUrl: constants.RPC_URL,
      });
      const { result } = await factoryContract.query_all_pools_details();

      const allPairs = result.map((pool: any) => ({
        asset_a: pool.pool_response.asset_a.address,
        asset_b: pool.pool_response.asset_b.address,
      }));
      setAllPools(allPairs);
    };
    getAllTokens();
  }, []);

  // Effect hook to simulate swaps on token change
  useEffect(() => {
    if (fromToken && toToken && operations.length > 0) {
      doSimulateSwap();
    }
  }, [fromToken, toToken, fromAmount, operations.length]);

  // Effect hook to update operations when tokens change
  useEffect(() => {
    if (fromToken && toToken) {
      const fromTokenContractID = appStore.allTokens.find(
        (token: Token) => token.name === fromToken.name
      )?.contractId;
      const toTokenContractID = appStore.allTokens.find(
        (token: Token) => token.name === toToken.name
      )?.contractId;

      if (!fromTokenContractID || !toTokenContractID) return;

      const { operations: ops } = findBestPath(toTokenContractID, fromTokenContractID, allPools);
      const _operations = ops.reverse();
      const _swapRoute = _operations
        .map(
          (op) => appStore.allTokens.find((token: any) => token.contractId === op.ask_asset)?.name
        )
        .filter(Boolean);

      setOperations((prevOps) => (prevOps !== _operations ? _operations : prevOps));
      setSwapRoute(`${fromToken.name} -> ${_swapRoute.join(' -> ')}`);
      if (storePersist.wallet.address) {
        handleTrustLine(toTokenContractID);
      }
    }
  }, [allPools, fromToken?.name, toToken?.name, storePersist.wallet.address]);

  /**
   * Handles adding a trustline for a token.
   *
   * @param {string} tokenAddress - The address of the token.
   * @async
   */
  const handleTrustLine = useCallback(
    async (tokenAddress: string): Promise<void> => {
      const trust = await checkTrustline(storePersist.wallet.address!, tokenAddress);
      setTrustlineButtonActive(!trust.exists);
      setTrustlineTokenName(trust.asset?.code || '');
      const tlAsset = await appStore.fetchTokenInfo(
        'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'
      );
      setTrustlineAssetAmount(Number(tlAsset?.balance) / 10 ** tlAsset?.decimals!);
      setTrustlineTokenName(trust.asset?.contract || '');
    },
    [storePersist.wallet.address]
  );

  /**
   * Adds a trustline for the specified token.
   *
   * @async
   */
  const addTrustLine = useCallback(async (): Promise<void> => {
    try {
      setTxBroadcasting(true);
      await fetchAndIssueTrustline(storePersist.wallet.address!, trustlineTokenName);
      setTrustlineButtonActive(false);
    } catch (e) {
      console.log(e);
    }
    setTxBroadcasting(false);
  }, [storePersist.wallet.address, trustlineTokenName]);

  return {
    error,
    loading,
    doSwap,
    onTokenClick,
  };
}

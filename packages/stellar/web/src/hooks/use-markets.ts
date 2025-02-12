'use client';

import { useCallback, useState, useEffect } from 'react';

import { NormalMarketFactoryContract } from '@normalfinance/stellar-contracts';
import { constants } from '@normalfinance/utils';
import { MarketInfo } from '@normalfinance/stellar-contracts/build/normal-market-factory';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  markets: MarketInfo[];
}

// ----------------------------------------------------------------------

export function useMarkets(): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [allMarkets, setAllMarkets] = useState<MarketInfo[]>([]); // State to hold index data

  /**
   * Fetch pool information by its address.
   *
   * @async
   * @function fetchPool
   * @param {string} poolAddress - The address of the liquidity pool.
   * @returns {Promise<Pool | undefined>} A promise that resolves to the pool information or undefined in case of failure.
   */
  const fetchMarket = useCallback(async (poolAddress: string) => {
    try {
      const PairContract = new PhoenixPairContract.Client({
        contractId: poolAddress,
        networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
        rpcUrl: constants.SOROBAN_RPC_URL,
      });

      const [pairConfig, pairInfo] = await Promise.all([
        PairContract.query_config(),
        PairContract.query_pool_info(),
      ]);

      if (pairConfig?.result && pairInfo?.result) {
        const [tokenA, tokenB] = await Promise.all([
          store.fetchTokenInfo(pairConfig.result.token_a),
          store.fetchTokenInfo(pairConfig.result.token_b),
        ]);

        // Fetch prices and calculate TVL
        const [priceA, priceB] = await Promise.all([
          fetchTokenPrices(tokenA?.symbol || ''),
          fetchTokenPrices(tokenB?.symbol || ''),
        ]);

        const tvl =
          (priceA * Number(pairInfo.result.asset_a.amount)) / 10 ** Number(tokenA?.decimals) +
          (priceB * Number(pairInfo.result.asset_b.amount)) / 10 ** Number(tokenB?.decimals);

        const stakingAddress = pairInfo.result.stake_address;

        const StakeContract = new PhoenixStakeContract.Client({
          contractId: stakingAddress,
          networkPassphrase: constants.NETWORK_PASSPHRASE,
          rpcUrl: constants.RPC_URL,
        });

        const [stakingInfo, allPoolDetails] = await Promise.all([
          StakeContract.query_total_staked(),
          new PhoenixFactoryContract.Client({
            contractId: FACTORY_ADDRESS,
            networkPassphrase: constants.NETWORK_PASSPHRASE,
            rpcUrl: constants.RPC_URL,
          }).query_all_pools_details(),
        ]);

        const totalStaked = Number(stakingInfo.result);
        const totalTokens = Number(
          allPoolDetails.result.find((pool: any) => pool.pool_address === poolAddress)
            ?.pool_response.asset_lp_share.amount
        );

     

        // Construct and return pool object if all fetches are successful
        return {
          tokens: [
            {
              name: tokenA?.symbol || '',
              icon: `/cryptoIcons/${tokenA?.symbol.toLowerCase()}.svg`,
              amount: Number(pairInfo.result.asset_a.amount) / 10 ** Number(tokenA?.decimals),
              category: '',
              usdValue: 0,
            },
            {
              name: tokenB?.symbol || '',
              icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
              amount: Number(pairInfo.result.asset_b.amount) / 10 ** Number(tokenB?.decimals),
              category: '',
              usdValue: 0,
            },
          ],
          tvl: formatCurrency('USD', tvl.toString(), navigator.language),
          maxApr: `${(apr / 2).toFixed(2)}%`,
          userLiquidity: 0,
          poolAddress: poolAddress,
        };
      }
    } catch (e) {
      console.log(e);
    }
    return;
  }, []);

  const fetchAllMarkets = useCallback(async () => {
    const MarketFactoryContract = new NormalMarketFactoryContract.Client({
      ...NormalMarketFactoryContract.networks.testnet,
      contractId: constants.MARKET_FACTORY_ADDRESS,
      networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
      rpcUrl: constants.SOROBAN_RPC_URL,
    });

    const markets = await MarketFactoryContract.query_markets({});

    const marketsWithData =
      markets && Array.isArray(markets.result)
        ? await Promise.all(
            markets.result.map(async (pool: string) => {
              return await fetchMarket(pool);
            })
          )
        : [];

    const marketsFiltered: MarketInfo[] = marketsWithData.filter(
      (el) =>
        el !== undefined &&
        el.tokens.length >= 2 &&
        el.marketAddress !== 'CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB'
    );
    setAllMarkets(marketsFiltered as Market[]);
    setLoading(false);
  }, [fetchMarket]);

  // On component mount, fetch pools
  useEffect(() => {
    fetchAllMarkets();
  }, [fetchAllMarkets]);

  return {
    error,
    loading,
    markets: allMarkets,
  };
}

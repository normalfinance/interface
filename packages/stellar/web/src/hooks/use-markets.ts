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
   * Fetch market information by its address.
   *
   * @async
   * @function fetchMarket
   * @param {string} marketAddress - The address of the market.
   * @returns {Promise<Market | undefined>} A promise that resolves to the market information or undefined in case of failure.
   */
  const fetchMarket = useCallback(async (marketAddress: string) => {
    try {
      const MarketContract = new NormalMarketContract.Client({
        contractId: marketAddress,
        networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
        rpcUrl: constants.SOROBAN_RPC_URL,
      });

      const [marketConfig, marketInfo] = await Promise.all([
        MarketContract.query_config(),
        MarketContract.query_market(),
      ]);

      if (marketConfig?.result && marketInfo?.result) {
        // Construct and return market object if all fetches are successful
        return {
          // tokens: [
          //   {
          //     name: tokenA?.symbol || '',
          //     icon: `/cryptoIcons/${tokenA?.symbol.toLowerCase()}.svg`,
          //     amount: Number(pairInfo.result.asset_a.amount) / 10 ** Number(tokenA?.decimals),
          //     category: '',
          //     usdValue: 0,
          //   },
          //   {
          //     name: tokenB?.symbol || '',
          //     icon: `/cryptoIcons/${tokenB?.symbol.toLowerCase()}.svg`,
          //     amount: Number(pairInfo.result.asset_b.amount) / 10 ** Number(tokenB?.decimals),
          //     category: '',
          //     usdValue: 0,
          //   },
          // ],
          marketAddress: marketAddress,
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
        el.marketAddress !== 'CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB'
    );
    setAllMarkets(marketsFiltered as Market[]);
    setLoading(false);
  }, [fetchMarket]);

  // On component mount, fetch markets
  useEffect(() => {
    fetchAllMarkets();
  }, [fetchAllMarkets]);

  return {
    error,
    loading,
    markets: allMarkets,
  };
}

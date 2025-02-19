'use client';

import type { MarketInfo } from '@normalfinance/stellar-contracts/build/normal-market-factory';

import { paths } from '@/routes/paths';
import { constants } from '@normalfinance/utils';
import { useState, useEffect, useCallback } from 'react';
import {
  NormalMarketContract,
  NormalMarketFactoryContract,
} from '@normalfinance/stellar-contracts';

// ----------------------------------------------------------------------

interface ReturnType {
  error: any | null;
  loading: boolean;
  markets: MarketInfo[];
  // onDepositCollateral: () => void;
  // onWithdrawCollateral: () => void;
  // onBorrowAndIncreaseLiquidity: () => void;
  // onRemoveLiquidityAndRepay: () => void;
  // onSwap: () => void;
  // onIncreaseLiquidity: () => void;
  // onDecreaseLiquidity: () => void;
}

// ----------------------------------------------------------------------

export function useMarkets(): ReturnType {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [allMarkets, setAllMarkets] = useState<MarketInfo[]>([]); // State to hold all market data

  /**
   * Fetch market information by its address.
   *
   * @async
   * @function fetchMarket
   * @param {string} marketAddress - The address of the market.
   * @param {number} index - The index of the market in the list of markets.
   * @returns {Promise<Market | undefined>} A promise that resolves to the market information or undefined in case of failure.
   */
  const fetchMarket = useCallback(async (marketAddress: string, index: number) => {
    try {
      const MarketContract = new NormalMarketContract.Client({
        contractId: marketAddress,
        networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
        rpcUrl: constants.SOROBAN_RPC_URL,
      });

      const market = await MarketContract.query_market();

      if (market) {
        // Construct and return market object if all fetches are successful
        return {
          id: index,
          name: market.name || '',
          price: 0,
          percentageChange: 0,
          performance: 0,
          status: '',
          avatarUrl: `/cryptoIcons/${market.name.toLowerCase()}.svg`,
          url: paths.markets.details(market.name),
          address: marketAddress,
        };
      }
      return undefined;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }, []);

  const fetchAllMarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const MarketFactoryContract = new NormalMarketFactoryContract.Client({
        ...NormalMarketFactoryContract.networks.testnet,
        contractId: constants.MARKET_FACTORY_ADDRESS,
        networkPassphrase: constants.SOROBAN_NETWORK_PASSPHRASE,
        rpcUrl: constants.SOROBAN_RPC_URL,
      });

      const markets = await MarketFactoryContract.query_markets({});

      // TODO: complete
      // const marketsWithData =
      //   markets && Array.isArray(markets.result)
      //     ? await Promise.all(
      //         markets.result.map(async (market: string, index) => await fetchMarket(market, index))
      //       )
      //     : [];

      // const marketsFiltered: MarketInfo[] = marketsWithData.filter(
      //   (el) =>
      //     el !== undefined &&
      //     el.address !== 'CBXBKAB6QIRUGTG77OQZHC46BIIPA5WDKIKZKPA2H7Q7CPKQ555W3EVB'
      // );
      // setAllMarkets(marketsFiltered as MarketInfo[]);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError(e as any);
    }
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

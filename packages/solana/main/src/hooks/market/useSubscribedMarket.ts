import { useEffect, useRef, useState } from "react";
import {
  Market,
  MarketAccount,
  // getNormalMarketProgram,
} from "@normalfinance/solana-sdk";
import { PublicKey, BulkAccountLoader } from "@normalfinance/solana-sdk";
import { Connection } from "@solana/web3.js";
import { useCommonNormalStore } from "@/stores";
import { COMMON_UI_UTILS } from "@/utils/common-ui-utils/commonUiUtils";

/**
 * Subscribed to changes in the synth market account.
 */
export const useSubscribedMarket = (
  marketPubkey?: string,
): {
  marketAccountData: Market | undefined;
  marketAccount: MarketAccount | undefined;
} => {
  const connection = useCommonNormalStore((s) => s.connection);
  const bulkAccountLoader = useCommonNormalStore((s) => s.bulkAccountLoader);

  const [marketAccountData, setMarketAccountData] = useState<MarketAccount | undefined>();
  const [marketAccount, setMarketAccount] = useState<MarketAccount | undefined>();
  const marketAccountRef = useRef<MarketAccount | undefined>();

  useEffect(() => {
    if (!marketPubkey || !connection || !bulkAccountLoader) return;

    syncMarketAccountAndData(connection, bulkAccountLoader, marketPubkey);

    return () => {
      setMarketAccount(undefined);
      marketAccountRef.current?.unsubscribe();
    };
  }, [marketPubkey, connection, bulkAccountLoader]);

  async function syncMarketAccountAndData(
    connection: Connection,
    bulkAccountLoader: BulkAccountLoader,
    marketPubkey: string,
  ) {
    const newWallet = COMMON_UI_UTILS.createThrowawayIWallet();
    // const normalMarketsProgram = getNormalMarketProgram(connection, newWallet);

    // const marketAccount = new MarketAccount(
    //   normalMarketsProgram,
    //   new PublicKey(marketPubkey),
    //   bulkAccountLoader,
    // );

    setMarketAccount(marketAccount);
    marketAccountRef.current = marketAccount;

    await marketAccount.subscribe();

    const marketAccountData = marketAccount.getData();

    setMarketAccountData(marketAccountData);

    marketAccount.eventEmitter.on("marketUpdate", (newMarketAccountData) => {
      setMarketAccountData(newMarketAccountData);
    });
  }

  return { marketAccountData, marketAccount };
};
import { CommonNormalStore } from '../stores/useCommonNormalStore';
import {
  BulkAccountLoader,
  NormalClient,
  NormalClientConfig,
  NormalEnv,
  IWallet,
  PollingNormalClientAccountSubscriber,
  PublicKey,
  Wallet,
  WhileValidTxSender,
  getMarketsAndOraclesForSubscription,
  initialize,
} from '@normalfinance/solana-sdk';
import { Commitment, Connection, Keypair } from '@solana/web3.js';
import { StoreApi } from 'zustand';

import type {
  Adapter,
  BaseMessageSignerWalletAdapter,
  // @ts-ignore
} from '@solana/wallet-adapter-base';
import { EnvironmentConstants, RpcEndpoint } from '@/utils/EnvironmentConstants';

const DEFAULT_WALLET = new Wallet(new Keypair());
const DEFAULT_COMMITMENT_LEVEL: Commitment = 'confirmed';

const createNormalActions = (
  get: StoreApi<CommonNormalStore>['getState'],
  set: (x: (s: CommonNormalStore) => void) => void
) => {
  const subscribeToNormalClientData = async () => {
    try {
      const normalClient = get().normalClient.client;

      if (!normalClient) {
        return;
      }

      let subscriptionResult = await normalClient.subscribe();

      if (!subscriptionResult) {
        // retry once
        subscriptionResult = await normalClient.subscribe();
      }

      normalClient.eventEmitter.on('update', () => {
        set((s) => {
          s.normalClient.updateSignaler = {};
        });
      });

      set((s) => {
        s.normalClient.isSubscribed = subscriptionResult;
      });

      return subscriptionResult;
    } catch (err) {
      // Todo notify about this or retry?
      console.log(err);
    }
  };

  /**
   *
   * @param newRpc Rpc URL to be updated to
   * @param newNormalEnv Normal environment to be updated to
   * @param subscribe Whether to subscribe to the new connection. Default is true.
   * @param additionalNormalClientConfig Additional normal client configuration
   * @returns
   */
  const updateConnection = async ({
    newRpc,
    newNormalEnv,
    subscribeToAccounts = true,
    additionalNormalClientConfig = {},
  }: {
    newRpc: RpcEndpoint;
    newNormalEnv?: NormalEnv;
    additionalNormalClientConfig?: Partial<NormalClientConfig>;
    subscribeToAccounts?: boolean;
  }) => {
    const storeState = get();
    const Env = storeState.env;
    const normalEnvToUse = newNormalEnv || Env.normalEnv;
    const additionalTxSenderCallbacks = Env.additionalTxSenderCallbacks;
    const sdkConfig = initialize({ env: normalEnvToUse });
    let rpcToUse = newRpc?.value;

    // Override rpc with one set from env variable
    if (Env.rpcOverride) {
      console.log(`overriding selected rpc with ${rpcToUse}`);
      rpcToUse = Env.rpcOverride;
    }

    let newConnection: Connection;
    try {
      newConnection = new Connection(rpcToUse, DEFAULT_COMMITMENT_LEVEL);
    } catch (e) {
      console.error('error connecting to rpc');

      // TODO -- decide how we want to handle notifications?
      // NOTIFICATION_UTILS.toast.warn(
      // 	'Error connecting to RPC. If the problem persists you may need to try restarting.'
      // );

      return;
    }

    const walletToUse = storeState.normalClient.client?.wallet ?? DEFAULT_WALLET;
    const currentNormalClient = storeState.normalClient.client;

    let accountLoader: BulkAccountLoader | undefined = undefined;

    if (currentNormalClient) {
      if (currentNormalClient.userAccountSubscriptionConfig.type === 'polling') {
        // reuse the previous account loader object
        accountLoader = (
          currentNormalClient.accountSubscriber as PollingNormalClientAccountSubscriber
        ).accountLoader;
        accountLoader.connection = newConnection;
      }
      await currentNormalClient.unsubscribe();
    }

    if (!accountLoader) {
      accountLoader = new BulkAccountLoader(
        newConnection,
        DEFAULT_COMMITMENT_LEVEL,
        storeState.get().env.basePollingRateMs
      );
    }

    const { oracleInfos, marketIndexes } = getMarketsAndOraclesForSubscription(normalEnvToUse);

    const normalClientConfig: NormalClientConfig = {
      connection: newConnection,
      wallet: walletToUse,
      programID: new PublicKey(sdkConfig.NORMAL_PROGRAM_ID),
      accountSubscription: {
        type: 'polling',
        accountLoader: accountLoader,
      },
      marketIndexes: marketIndexes,
      oracleInfos: oracleInfos,
      userStats: true,
      includeDelegates: true,
      env: normalEnvToUse,
      // dont waste rpc calls loading users for this made up wallet
      skipLoadUsers: true,
      txVersion: 0,
      ...additionalNormalClientConfig,
    };

    const newNormalClient = new NormalClient(normalClientConfig);

    const rpcs = EnvironmentConstants.rpcs[normalEnvToUse === 'devnet' ? 'dev' : 'mainnet'];

    const additionalConnections = rpcs
      .filter((rpc) => rpc.value !== newRpc?.value && rpc.allowAdditionalConnection)
      .map((rpc) => new Connection(rpc.value, DEFAULT_COMMITMENT_LEVEL));

    newNormalClient.txSender = new WhileValidTxSender({
      connection: newConnection,
      wallet: newNormalClient.wallet,
      retrySleep: Env.txSenderRetryInterval,
      additionalConnections,
      additionalTxSenderCallbacks,
      txHandler: newNormalClient.txHandler,
    });

    set((s) => {
      s.bulkAccountLoader = accountLoader;
      s.connection = newConnection;
      s.normalClient.client = newNormalClient;
      s.env.normalEnv = normalEnvToUse;
      // s.currentRpc = newRpc;
      s.sdkConfig = sdkConfig;
    });

    if (subscribeToAccounts) {
      await subscribeToNormalClientData();
    }
  };

  /*
   * Fetches user accounts and users for authority and subscribes to them
   */
  const fetchAndSubscribeToUsersAndSubaccounts = async (
    normalClient: NormalClient,
    authority: PublicKey
  ) => {
    // This method seems pretty slow, is there a better way?
    // Nothing else I've tried is working...
    const userAccounts = await normalClient.getUserAccountsForAuthority(authority);

    await Promise.all(
      userAccounts.map((account) => normalClient.addUser(account.subAccountId, authority))
    );

    const users = normalClient.getUsers();

    set((s) => {
      s.authority = authority;
      s.userAccountNotInitialized = users.length === 0;
      s.subscribedToSubaccounts = true;
      s.userAccounts = userAccounts;
    });

    return userAccounts;
  };

  const handleWalletDisconnect = async () => {
    const state = get();

    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const normalClient = state.normalClient.client!;

    // Switch to a random wallet to stop
    normalClient.updateWallet(new Wallet(new Keypair()));
    state.clearUserData();
  };

  const handleWalletConnect = async (
    authority: PublicKey,
    adapter: Adapter,
    subscribeToNormalUsers = true
  ) => {
    const state = get();
    state.clearUserData();
    const normalClient = state?.normalClient?.client;

    if (!normalClient) return;

    try {
      if (subscribeToNormalUsers) {
        normalClient.updateWallet(adapter as IWallet);

        const userAccounts = await fetchAndSubscribeToUsersAndSubaccounts(normalClient, authority);
        if (userAccounts.length > 0) {
          normalClient.switchActiveUser(userAccounts[0].subAccountId);
        }

        set((s) => {
          s.authority = authority;
          s.subscribedToSubaccounts = true;
        });
      } else {
        set((s) => {
          s.authority = authority;
        });
      }
    } catch (err) {
      console.log('failed to subscribe to users');
      console.log(err);
      set((s) => {
        s.subscribedToSubaccounts = false;
      });
    }
  };

  const emulateAccount = async (props: { authority: PublicKey }) => {
    const state = get();
    const normalClient = state?.normalClient?.client;
    if (!normalClient) return;

    const newKeypair = new Keypair({
      publicKey: props.authority.toBytes(),
      secretKey: new Keypair().publicKey.toBytes(),
    });
    const newWallet: BaseMessageSignerWalletAdapter = {
      publicKey: newKeypair.publicKey,
      autoApprove: false,
      connected: true,
      //@ts-ignore
      signTransaction: () => {
        return Promise.resolve();
      },
      //@ts-ignore
      signAllTransactions: () => {
        return Promise.resolve();
      },
      //@ts-ignore
      connect: () => {},
      disconnect: async () => {},
      //@ts-ignore
      on: (_event: string, _fn: () => void) => {},
    };

    const success = await normalClient.updateWallet(newWallet as IWallet);
    if (!success) {
      console.log('Error emulating account');
      return;
    }

    const subscribeSuccess = await normalClient.subscribe();
    if (!subscribeSuccess) {
      console.log('Error subscribing to emulated account');
      return;
    }

    const userAccounts = await fetchAndSubscribeToUsersAndSubaccounts(
      normalClient,
      props.authority
    );
    if (userAccounts.length > 0) {
      normalClient.switchActiveUser(userAccounts[0].subAccountId);
    }
    set((s) => {
      s.emulationMode = true;
    });
  };

  return {
    handleWalletConnect,
    updateConnection,
    emulateAccount,
    handleWalletDisconnect,
    fetchAndSubscribeToUsersAndSubaccounts,
  };
};

export default createNormalActions;

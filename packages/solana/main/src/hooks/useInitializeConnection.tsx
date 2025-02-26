import { useEffect } from 'react';
import { useCommonNormalStore } from '../stores/useCommonNormalStore';
import { useCommonNormalActions } from './useCommonNormalActions';
import { useCurrentRpc } from './useCurrentRpc';
import { NormalClientConfig } from '@normalfinance/solana-sdk';

const useInitializeConnection = (
  enable: boolean,
  additionalNormalClientConfig: Partial<NormalClientConfig> = {}
) => {
  const Env = useCommonNormalStore((s) => s.env);
  const actions = useCommonNormalActions();
  const [currentRpc] = useCurrentRpc();

  const initConnection = async () => {
    if (!enable) return;

    const rpcToUse = Env.rpcOverride
      ? {
          label: 'RPC Override',
          value: Env.rpcOverride,
          allowAdditionalConnection: false,
        }
      : currentRpc;

    if (Env.isDev) {
      console.log(`using normalEnv ${Env.normalEnv}`);
      console.log(`using rpc ${currentRpc.value}`);
    }

    if (!rpcToUse) {
      return;
    }

    actions.updateConnection({
      newRpc: rpcToUse,
      newNormalEnv: Env.normalEnv,
      additionalNormalClientConfig,
      subscribeToAccounts: Env.subscribeToAccounts ?? true,
    });
  };

  useEffect(() => {
    initConnection();
  }, [currentRpc.value, Env.normalEnv, Env.rpcOverride]);
};

export default useInitializeConnection;

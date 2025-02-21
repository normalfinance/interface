import React, { useEffect } from 'react';
import useIdlePollingRateSwitcher from '../hooks/useIdlePollingRateSwitcher';
import useInitializeConnection from '../hooks/useInitializeConnection';
import { useSolBalance } from '../hooks/useSolBalance';
import { useEmulation } from '../hooks/useEmulation';
import { useGeoBlocking } from '../hooks/useGeoBlocking';
import { useCommonNormalStore } from '../stores';
import NormalWalletProvider from './NormalWalletProvider';
import { NormalClientConfig } from '@normalfinance/solana-sdk';
// import { Breakpoints, useSyncScreenSize } from '../stores/useScreenSizeStore';
import { WalletAdapter } from '@solana/wallet-adapter-base';

export interface AppSetupProps {
  priorityFeePollingMultiplier: number;
  txSenderRetryInterval: number;
  subscribeToAccounts?: boolean; // default is true
}

type NormalAppHooksProps = {
  children: React.ReactNode;
  disable?: {
    idlePollingRateSwitcher?: boolean;
    emulation?: boolean;
    geoblocking?: boolean;
    initConnection?: boolean;
    subscribeSolBalance?: boolean;
  };
  geoBlocking?: {
    callback?: () => void;
  };

  // instead of making this optional and setting a default, we force the user to provide the breakpoints,
  // although they can still import DEFAULT_BREAKPOINTS. this ensures that the user is aware of
  // the breakpoints they are using
  // breakpoints: Breakpoints;
  additionalNormalClientConfig?: Partial<NormalClientConfig>;
};

export type NormalProviderProps = {
  disableAutoconnect?: boolean;
  autoconnectionDelay?: number;
  wallets?: WalletAdapter[];
} & NormalAppHooksProps;

const NormalProviderInner = (props: NormalAppHooksProps) => {
  const get = useCommonNormalStore((s) => s.get);

  useEffect(() => {
    // @ts-ignore
    window.normal_dev = { getStore: get };
  }, []);

  !props.disable?.idlePollingRateSwitcher && useIdlePollingRateSwitcher();
  !props.disable?.emulation && useEmulation();
  !props.disable?.geoblocking && useGeoBlocking(props?.geoBlocking?.callback);

  useInitializeConnection(!props.disable?.initConnection, props?.additionalNormalClientConfig);
  useSolBalance(props.disable?.subscribeSolBalance);
  // useSyncScreenSize(props.breakpoints);

  // not sure why this doesn't work in normal provider, but works in app setup
  // useSyncWalletToStore(props?.syncWalletToStore?.clearDataFromStore);
  return <>{props.children}</>;
};

const NormalProvider = (props: NormalProviderProps & { children: React.ReactNode }) => {
  return (
    <>
      <NormalWalletProvider
        wallets={props.wallets}
        disableAutoconnect={props.disableAutoconnect}
        autoconnectionDelay={props.autoconnectionDelay}
      >
        {/* Need to put this _INSIDE_ the wallet provider, otherwise, every loop where a hook inside wallet provider was keeping the wallet state in sync, the outer NormalProvider was running causing an infinite loop */}
        <NormalProviderInner
          disable={props.disable}
          geoBlocking={props.geoBlocking}
          // breakpoints={props.breakpoints}
          additionalNormalClientConfig={props.additionalNormalClientConfig}
        >
          {props.children}
        </NormalProviderInner>
      </NormalWalletProvider>
    </>
  );
};

export { NormalProvider };

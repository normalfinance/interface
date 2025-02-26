import { AppSetupProps } from '@/providers';
import { Config as CommonConfig, Initialize as InitializeCommon } from '@/utils/Config';
import { NormalEnv, Wallet, initialize } from '@normalfinance/solana-sdk';
import { Keypair } from '@solana/web3.js';

export const ARBITRARY_WALLET = new Wallet(new Keypair());

const normalEnv =
  process.env.NEXT_PUBLIC_NORMAL_ENV === 'mainnet-beta' ? 'mainnet-beta' : ('devnet' as NormalEnv);

initialize({ env: normalEnv });
InitializeCommon(normalEnv);

interface EnvironmentVariables extends AppSetupProps {
  normalEnv: NormalEnv;
  isDev: boolean | undefined;
  basePollingRateMs: number;
  rpcOverride: string | undefined;
}

const Env: EnvironmentVariables = {
  normalEnv,
  isDev:
    !process.env.NEXT_PUBLIC_ENV ||
    ['local', 'master', 'devnet'].includes(process.env.NEXT_PUBLIC_ENV),
  basePollingRateMs: process.env.NEXT_PUBLIC_BASE_POLLING_RATE_MS
    ? Number(process.env.NEXT_PUBLIC_BASE_POLLING_RATE_MS)
    : 1000,
  rpcOverride: process.env.NEXT_PUBLIC_RPC_OVERRIDE,
  priorityFeePollingMultiplier: 5,
  txSenderRetryInterval: 5000,
};

// Markets
export const MARKETS_LOOKUP = CommonConfig.marketsLookup;

export default Env;

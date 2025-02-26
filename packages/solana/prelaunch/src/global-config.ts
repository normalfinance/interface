import packageJson from '../package.json';
import { SwapFeeInfo } from './types/swap-fee-info';
import { Token } from './types/token';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  isStaticExport: boolean;
  privy: {
    appId: string;
    secret: string;
  };
  tokenList: Token[];
  swapFeeInfo: SwapFeeInfo;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Normal',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  privy: {
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '',
    secret: process.env.PRIVY_APP_SECRET ?? '',
  },
  tokenList: [
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=040',
      name: 'Solana',
      shortname: 'SOL',
      owned: true,
      countstatus: 0.02106,
      pricestatus: 134.11,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040',
      name: 'Bitcoin',
      shortname: 'nBTC',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 86204.89,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://token-icons.s3.amazonaws.com/eth.png',
      name: 'Ethereum',
      shortname: 'nETH',
      owned: true,
      countstatus: 0.02106,
      pricestatus: 2372.25,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=040',
      name: 'Ripple',
      shortname: 'nXRP',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 2.21,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/sui-sui-logo.png?v=040',
      name: 'Sui',
      shortname: 'nSUI',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 2.86,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=040',
      name: 'DogeCoin',
      shortname: 'nDOGE',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 0.2021,
      featured: false,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 2,
      url: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      name: 'USDC',
      shortname: 'USDC',
      owned: false,
      countstatus: 0,
      pricestatus: 0.9998,
      featured: false,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
  ],
  swapFeeInfo: {
    feePercentage: 0.25,
    networkCost: 1.0,
    priceImpact: -0.3,
    maxSlippage: 0.5,
  },
};

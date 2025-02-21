export interface RpcEndpoint {
  label: string;
  value: string;
  wsValue?: string;
  allowAdditionalConnection: boolean;
}

export const EnvironmentConstants = {
  rpcs: {
    dev: [
      {
        label: 'Helius',
        value: 'https://detailed-sharleen-fast-devnet.helius-rpc.com',
        wsValue: 'wss://detailed-sharleen-fast-devnet.helius-rpc.com',
        allowAdditionalConnection: true,
      },
    ] as RpcEndpoint[],
    mainnet: [
      {
        label: 'Helius 1',
        value: 'https://morna-skm1k6-fast-mainnet.helius-rpc.com/',
        wsValue: 'wss://morna-skm1k6-fast-mainnet.helius-rpc.com/',
        allowAdditionalConnection: true,
      },
    ] as RpcEndpoint[],
  },
  historyServerUrl: {
    dev: 'https://master.api.normalfinance.io',
    mainnet: 'https://mainnet-beta.api.normalfinance.io',
    staging: 'https://staging.api.normalfinance.io',
  },
  eventsServerUrl: {
    mainnet: 'wss://events.normalfinance.io/ws',
    staging: 'wss://events.normalfinance.io/ws',
  },
  fastlaneServerUrl: {
    mainnet: 'https://fastlane.normalfinance.io',
    staging: 'https://master.fastlane.normalfinance.io',
  },
};

import { OracleSource } from '../';
import { NormalEnv } from '../';
import { PublicKey } from '@solana/web3.js';

export type MarketConfig = {
	fullName?: string;
	category?: string[];
	symbol: string;
	baseAssetSymbol: string;
	marketIndex: number;
	launchTs: number;
	oracle: PublicKey;
	oracleSource: OracleSource;
	pythFeedId?: string;
};

export const DevnetMarkets: MarketConfig[] = [
	{
		fullName: 'Bitcoin',
		category: ['L1', 'Payment'],
		symbol: 'BTC-USDC',
		baseAssetSymbol: 'BTC',
		marketIndex: 0,
		oracle: new PublicKey('486kr3pmFPfTsS4aZgcsQ7kS4i9rjMsYYZup6HQNSTT4'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
	},
	{
		fullName: 'Ethereum',
		category: ['L1', 'Infra'],
		symbol: 'ETH-USDC',
		baseAssetSymbol: 'ETH',
		marketIndex: 1,
		oracle: new PublicKey('6bEp2MiyoiiiDxcVqE8rUHQWwHirXUXtKfAEATTVqNzT'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
	},
	{
		fullName: 'Doge',
		category: ['Meme', 'Dog'],
		symbol: 'DOGE-USDC',
		baseAssetSymbol: 'DOGE',
		marketIndex: 2,
		oracle: new PublicKey('23y63pHVwKfYSCDFdiGRaGbTYWoyr8UzhUE7zukyf6gK'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
	},
	{
		fullName: 'Binance Coin',
		category: ['Exchange'],
		symbol: 'BNB-USDC',
		baseAssetSymbol: 'BNB',
		marketIndex: 3,
		oracle: new PublicKey('Dk8eWjuQHMbxJAwB9Sg7pXQPH4kgbg8qZGcUrWcD9gTm'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
	},
	{
		fullName: 'Sui',
		category: ['L1'],
		symbol: 'SUI-USDC',
		baseAssetSymbol: 'SUI',
		marketIndex: 4,
		oracle: new PublicKey('HBordkz5YxjzNURmKUY4vfEYFG9fZyZNeNF1VDLMoemT'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
	},
	{
		fullName: 'XRP',
		category: ['Payments'],
		symbol: 'XRP-USDC',
		baseAssetSymbol: 'XRP',
		marketIndex: 5,
		oracle: new PublicKey('9757epAjXWCWQH98kyK9vzgehd1XDVEf7joNHUaKk3iV'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
	},
];

export const MainnetMarkets: MarketConfig[] = [
	{
		fullName: 'Bitcoin',
		category: ['L1', 'Payment'],
		symbol: 'BTC-USDC',
		baseAssetSymbol: 'BTC',
		marketIndex: 0,
		oracle: new PublicKey('486kr3pmFPfTsS4aZgcsQ7kS4i9rjMsYYZup6HQNSTT4'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
	},
	{
		fullName: 'Ethereum',
		category: ['L1', 'Infra'],
		symbol: 'ETH-USDC',
		baseAssetSymbol: 'ETH',
		marketIndex: 1,
		oracle: new PublicKey('6bEp2MiyoiiiDxcVqE8rUHQWwHirXUXtKfAEATTVqNzT'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
	},

	{
		fullName: 'Doge',
		category: ['Meme', 'Dog'],
		symbol: 'DOGE-USDC',
		baseAssetSymbol: 'DOGE',
		marketIndex: 2,
		oracle: new PublicKey('23y63pHVwKfYSCDFdiGRaGbTYWoyr8UzhUE7zukyf6gK'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
	},
	{
		fullName: 'Binance Coin',
		category: ['Exchange'],
		symbol: 'BNB-USDC',
		baseAssetSymbol: 'BNB',
		marketIndex: 3,
		oracle: new PublicKey('Dk8eWjuQHMbxJAwB9Sg7pXQPH4kgbg8qZGcUrWcD9gTm'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
	},
	{
		fullName: 'Sui',
		category: ['L1'],
		symbol: 'SUI-USDC',
		baseAssetSymbol: 'SUI',
		marketIndex: 4,
		oracle: new PublicKey('HBordkz5YxjzNURmKUY4vfEYFG9fZyZNeNF1VDLMoemT'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
	},

	{
		fullName: 'XRP',
		category: ['Payments'],
		symbol: 'XRP-USDC',
		baseAssetSymbol: 'XRP',
		marketIndex: 5,
		oracle: new PublicKey('9757epAjXWCWQH98kyK9vzgehd1XDVEf7joNHUaKk3iV'),
		launchTs: 0,
		oracleSource: OracleSource.PYTH_PULL,
		pythFeedId:
			'0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
	},
];

export const Markets: { [key in NormalEnv]: MarketConfig[] } = {
	devnet: DevnetMarkets,
	'mainnet-beta': MainnetMarkets,
};

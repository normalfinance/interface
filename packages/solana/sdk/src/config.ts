import { ConfirmOptions } from '@solana/web3.js';
import { SynthMarketAccount, PublicKey, VaultAccount } from '.';
import {
	DevnetMarkets,
	MainnetMarkets,
	MarketConfig,
	Markets,
} from './constants/markets';
import { OracleInfo } from './oracles/types';
import { Program, ProgramAccount } from '@coral-xyz/anchor';
import {
	ON_DEMAND_DEVNET_PID,
	ON_DEMAND_MAINNET_PID,
} from '@switchboard-xyz/on-demand';

type NormalConfig = {
	ENV: NormalEnv;
	PYTH_ORACLE_MAPPING_ADDRESS: string;
	NORMAL_PROGRAM_ID: string;
	NORMAL_ORACLE_RECEIVER_ID: string;
	USDC_MINT_ADDRESS: string;
	V2_ALPHA_TICKET_MINT_ADDRESS: string;
	MARKETS: MarketConfig[];
	MARKET_LOOKUP_TABLE: string;
	PYTH_PULL_ORACLE_LOOKUP_TABLE?: string;
	SB_ON_DEMAND_PID: PublicKey;
};

export type NormalEnv = 'devnet' | 'mainnet-beta';

export const NORMAL_PROGRAM_ID = 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH';
export const NORMAL_ORACLE_RECEIVER_ID =
	'G6EoTTTgpkNBtVXo96EQp2m6uwwVh2Kt6YidjkmQqoha';

export const DEFAULT_CONFIRMATION_OPTS: ConfirmOptions = {
	preflightCommitment: 'confirmed',
	commitment: 'confirmed',
};

export const configs: { [key in NormalEnv]: NormalConfig } = {
	devnet: {
		ENV: 'devnet',
		PYTH_ORACLE_MAPPING_ADDRESS: 'BmA9Z6FjioHJPpjT39QazZyhDRUdZy2ezwx4GiDdE2u2',
		NORMAL_PROGRAM_ID,
		USDC_MINT_ADDRESS: '8zGuJQqwhZafTah7Uc7Z4tXRnguqkn5KLFAP8oV6PHe2',

		V2_ALPHA_TICKET_MINT_ADDRESS:
			'DeEiGWfCMP9psnLGkxGrBBMEAW5Jv8bBGMN8DCtFRCyB',
		MARKETS: DevnetMarkets,
		MARKET_LOOKUP_TABLE: 'FaMS3U4uBojvGn5FSDEPimddcXsCfwkKsFgMVVnDdxGb',
		NORMAL_ORACLE_RECEIVER_ID,
		SB_ON_DEMAND_PID: ON_DEMAND_DEVNET_PID,
	},
	'mainnet-beta': {
		ENV: 'mainnet-beta',
		PYTH_ORACLE_MAPPING_ADDRESS: 'AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J',
		NORMAL_PROGRAM_ID,
		USDC_MINT_ADDRESS: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		V2_ALPHA_TICKET_MINT_ADDRESS:
			'Cmvhycb6LQvvzaShGw4iDHRLzeSSryioAsU98DSSkMNa',
		MARKETS: MainnetMarkets,
		MARKET_LOOKUP_TABLE: 'D9cnvzswDikQDf53k4HpQ3KJ9y1Fv3HGGDFYMXnK5T6c',
		NORMAL_ORACLE_RECEIVER_ID,
		SB_ON_DEMAND_PID: ON_DEMAND_MAINNET_PID,
	},
};

let currentConfig: NormalConfig = configs.devnet;

export const getConfig = (): NormalConfig => currentConfig;

/**
 * Allows customization of the SDK's environment and endpoints. You can pass individual settings to override the settings with your own presets.
 *
 * Defaults to master environment if you don't use this function.
 * @param props
 * @returns
 */
export const initialize = (props: {
	env: NormalEnv;
	overrideEnv?: Partial<NormalConfig>;
}): NormalConfig => {
	//@ts-ignore
	if (props.env === 'master')
		return { ...configs['devnet'], ...(props.overrideEnv ?? {}) };

	currentConfig = { ...configs[props.env], ...(props.overrideEnv ?? {}) };

	return currentConfig;
};


export function getMarketsAndOraclesForSubscription(env: NormalEnv): {
	marketIndexes: number[];
	indexMarketIndexes: number[];
	oracleInfos: OracleInfo[];
} {
	const synthMarketIndexes = [];
	const indexMarketIndexes = [];
	const oracleInfos = new Map<string, OracleInfo>();

	for (const market of Markets[env]) {
		synthMarketIndexes.push(market.marketIndex);
		oracleInfos.set(market.oracle.toString(), {
			publicKey: market.oracle,
			source: market.oracleSource,
		});
	}

	for (const spotMarket of SpotMarkets[env]) {
		indexMarketIndexes.push(spotMarket.marketIndex);
		oracleInfos.set(spotMarket.oracle.toString(), {
			publicKey: spotMarket.oracle,
			source: spotMarket.oracleSource,
		});
	}

	return {
		synthMarketIndexes: synthMarketIndexes,
		indexMarketIndexes: indexMarketIndexes,
		oracleInfos: Array.from(oracleInfos.values()),
	};
}

export async function findAllMarketAndOracles(program: Program): Promise<{
	marketIndexes: number[];
	marketAccounts: SynthMarketAccount[];
	vaultIndexes: number[];
	oracleInfos: OracleInfo[];
	vaultAccounts: VaultAccount[];
}> {
	const perpMarketIndexes = [];
	const spotMarketIndexes = [];
	const oracleInfos = new Map<string, OracleInfo>();

	const perpMarketProgramAccounts =
		(await program.account.perpMarket.all()) as ProgramAccount<PerpMarketAccount>[];
	const spotMarketProgramAccounts =
		(await program.account.spotMarket.all()) as ProgramAccount<SpotMarketAccount>[];

	for (const perpMarketProgramAccount of perpMarketProgramAccounts) {
		const perpMarket = perpMarketProgramAccount.account as PerpMarketAccount;
		perpMarketIndexes.push(perpMarket.marketIndex);
		oracleInfos.set(perpamm.oracle.toString(), {
			publicKey: perpamm.oracle,
			source: perpamm.oracleSource,
		});
	}

	for (const spotMarketProgramAccount of spotMarketProgramAccounts) {
		const spotMarket = spotMarketProgramAccount.account as SpotMarketAccount;
		spotMarketIndexes.push(spotMarket.marketIndex);
		oracleInfos.set(spotMarket.oracle.toString(), {
			publicKey: spotMarket.oracle,
			source: spotMarket.oracleSource,
		});
	}

	return {
		perpMarketIndexes,
		perpMarketAccounts: perpMarketProgramAccounts.map(
			(account) => account.account
		),
		spotMarketIndexes,
		spotMarketAccounts: spotMarketProgramAccounts.map(
			(account) => account.account
		),
		oracleInfos: Array.from(oracleInfos.values()),
	};
}

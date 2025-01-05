import { PublicKey } from '@solana/web3.js';
import { DataAndSlot } from './types';
import { isVariant, MarketAccount, VaultAccount } from '../types';

export function capitalize(value: string): string {
	return value[0].toUpperCase() + value.slice(1);
}

export function findDelistedMarketsAndOracles(
	markets: DataAndSlot<MarketAccount>[],
	vaults: DataAndSlot<VaultAccount>[]
): { marketIndexes: number[]; oracles: PublicKey[] } {
	const delistedMarketIndexes = [];
	const delistedOracles = [];
	for (const market of markets) {
		if (!market.data) {
			continue;
		}

		if (isVariant(market.data.status, 'delisted')) {
			delistedMarketIndexes.push(market.data.marketIndex);
			delistedOracles.push(market.data.amm.oracle);
		}
	}

	// make sure oracle isn't used by spot market
	const filteredDelistedOracles = [];
	// for (const delistedOracle of delistedOracles) {
	// 	for (const spotMarket of spotMarkets) {
	// 		if (!spotMarket.data) {
	// 			continue;
	// 		}

	// 		if (spotMarket.data.oracle.equals(delistedOracle)) {
	// 			break;
	// 		}
	// 	}
	// 	filteredDelistedOracles.push(delistedOracle);
	// }

	return {
		marketIndexes: delistedMarketIndexes,
		oracles: filteredDelistedOracles,
	};
}

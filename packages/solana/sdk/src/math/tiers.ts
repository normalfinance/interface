import { isVariant, MarketAccount } from '../types';

export function getMarketTierNumber(market: MarketAccount): number {
	if (isVariant(market.contractTier, 'a')) {
		return 0;
	} else if (isVariant(market.contractTier, 'b')) {
		return 1;
	} else if (isVariant(market.contractTier, 'c')) {
		return 2;
	} else if (isVariant(market.contractTier, 'speculative')) {
		return 3;
	} else if (isVariant(market.contractTier, 'highlySpeculative')) {
		return 4;
	} else {
		return 5;
	}
}

export function syntheticTierIsAsSafeAs(
	syntheticTier: number,
	otherSyntheticTier: number
): boolean {
	const asSafeAsSynthetic = syntheticTier <= otherSyntheticTier;
	return asSafeAsSynthetic;
}

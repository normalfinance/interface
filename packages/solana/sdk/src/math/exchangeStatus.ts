import {
	DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT,
	PERCENTAGE_PRECISION,
	ONE,
} from '../constants/numericConstants';
import {
	ExchangeStatus,
	MarketAccount,
	Operation,
	StateAccount,
	isVariant,
	InsuranceFundOperation,
} from '../types';
import { BN } from '@coral-xyz/anchor';

export function exchangePaused(state: StateAccount): boolean {
	return state.exchangeStatus !== ExchangeStatus.ACTIVE;
}

export function fillPaused(
	state: StateAccount,
	market: MarketAccount
): boolean {
	if (
		(state.exchangeStatus & ExchangeStatus.FILL_PAUSED) ===
		ExchangeStatus.FILL_PAUSED
	) {
		return true;
	}

	return isOperationPaused(market.pausedOperations, Operation.FILL);
}

export function ammPaused(state: StateAccount, market: MarketAccount): boolean {
	if (
		(state.exchangeStatus & ExchangeStatus.AMM_PAUSED) ===
		ExchangeStatus.AMM_PAUSED
	) {
		return true;
	}

	const operationPaused = isOperationPaused(
		market.pausedOperations,
		Operation.AMM_FILL
	);
	if (operationPaused) {
		return true;
	}
	if (isAmmDrawdownPause(market as MarketAccount)) {
		return true;
	}

	return false;
}

export function isOperationPaused(
	pausedOperations: number,
	operation: Operation | InsuranceFundOperation
): boolean {
	return (pausedOperations & operation) > 0;
}

export function isAmmDrawdownPause(market: MarketAccount): boolean {
	let quoteDrawdownLimitBreached: boolean;

	if (
		isVariant(market.contractTier, 'a') ||
		isVariant(market.contractTier, 'b')
	) {
		quoteDrawdownLimitBreached = amm.netRevenueSinceLastFunding.lte(
			DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT.muln(400)
		);
	} else {
		quoteDrawdownLimitBreached = amm.netRevenueSinceLastFunding.lte(
			DEFAULT_REVENUE_SINCE_LAST_FUNDING_SPREAD_RETREAT.muln(200)
		);
	}

	if (quoteDrawdownLimitBreached) {
		const percentDrawdown = amm.netRevenueSinceLastFunding
			.mul(PERCENTAGE_PRECISION)
			.div(BN.max(amm.totalFeeMinusDistributions, ONE));

		let percentDrawdownLimitBreached: boolean;

		if (isVariant(market.contractTier, 'a')) {
			percentDrawdownLimitBreached = percentDrawdown.lte(
				PERCENTAGE_PRECISION.divn(50).neg()
			);
		} else if (isVariant(market.contractTier, 'b')) {
			percentDrawdownLimitBreached = percentDrawdown.lte(
				PERCENTAGE_PRECISION.divn(33).neg()
			);
		} else if (isVariant(market.contractTier, 'c')) {
			percentDrawdownLimitBreached = percentDrawdown.lte(
				PERCENTAGE_PRECISION.divn(25).neg()
			);
		} else {
			percentDrawdownLimitBreached = percentDrawdown.lte(
				PERCENTAGE_PRECISION.divn(20).neg()
			);
		}

		if (percentDrawdownLimitBreached) {
			return true;
		}
	}

	return false;
}

import { BN } from '@coral-xyz/anchor';
import {
	MarketAccount,
	OrderSide,
	SpotMarketAccount,
	SpotBalanceType,
	MarketType,
} from '../types';
import {
	calculateAmmReservesAfterSwap,
	calculatePrice,
	calculateUpdatedAMMSpreadReserves,
	getSwapDirection,
	calculateUpdatedAMM,
	calculateMarketOpenBidAsk,
} from './amm';
import { OraclePriceData } from '../oracles/types';
import {
	BASE_PRECISION,
	MARGIN_PRECISION,
	PRICE_TO_QUOTE_PRECISION,
	ZERO,
	QUOTE_SPOT_MARKET_INDEX,
} from '../constants/numericConstants';
import { getTokenAmount } from './spotBalance';
import { assert } from '../assert/assert';

/**
 * Calculates market mark price
 *
 * @param market
 * @return markPrice : Precision PRICE_PRECISION
 */
export function calculateReservePrice(
	market: MarketAccount,
	oraclePriceData: OraclePriceData
): BN {
	const newAmm = calculateUpdatedAMM(market.amm, oraclePriceData);
	return calculatePrice(
		newAmm.baseAssetReserve,
		newAmm.quoteAssetReserve,
		newAmm.pegMultiplier
	);
}

/**
 * Calculates market bid price
 *
 * @param market
 * @return bidPrice : Precision PRICE_PRECISION
 */
export function calculateBidPrice(
	market: MarketAccount,
	oraclePriceData: OraclePriceData
): BN {
	const { baseAssetReserve, quoteAssetReserve, newPeg } =
		calculateUpdatedAMMSpreadReserves(
			market.amm,
			OrderSide.SELL,
			oraclePriceData
		);

	return calculatePrice(baseAssetReserve, quoteAssetReserve, newPeg);
}

/**
 * Calculates market ask price
 *
 * @param market
 * @return askPrice : Precision PRICE_PRECISION
 */
export function calculateAskPrice(
	market: MarketAccount,
	oraclePriceData: OraclePriceData
): BN {
	const { baseAssetReserve, quoteAssetReserve, newPeg } =
		calculateUpdatedAMMSpreadReserves(
			market.amm,
			OrderSide.BUY,
			oraclePriceData
		);

	return calculatePrice(baseAssetReserve, quoteAssetReserve, newPeg);
}

export function calculateNewMarketAfterTrade(
	baseAssetAmount: BN,
	direction: OrderSide,
	market: MarketAccount
): MarketAccount {
	const [newQuoteAssetReserve, newBaseAssetReserve] =
		calculateAmmReservesAfterSwap(
			market.amm,
			'base',
			baseAssetAmount.abs(),
			getSwapDirection('base', direction)
		);

	const newAmm = Object.assign({}, market.amm);
	const newMarket = Object.assign({}, market);
	newMarket.amm = newAmm;
	newamm.quoteAssetReserve = newQuoteAssetReserve;
	newamm.baseAssetReserve = newBaseAssetReserve;

	return newMarket;
}

export function calculateOracleReserveSpread(
	market: MarketAccount,
	oraclePriceData: OraclePriceData
): BN {
	const reservePrice = calculateReservePrice(market, oraclePriceData);
	return calculateOracleSpread(reservePrice, oraclePriceData);
}

export function calculateOracleSpread(
	price: BN,
	oraclePriceData: OraclePriceData
): BN {
	return price.sub(oraclePriceData.price);
}

export function calculateMarketAvailablePNL(
	perpMarket: MarketAccount,
	spotMarket: SpotMarketAccount
): BN {
	return getTokenAmount(
		perpMarket.pnlPool.scaledBalance,
		spotMarket,
		SpotBalanceType.DEPOSIT
	);
}

export function calculateMarketMaxAvailableInsurance(
	perpMarket: MarketAccount,
	spotMarket: SpotMarketAccount
): BN {
	assert(spotMarket.marketIndex == QUOTE_SPOT_MARKET_INDEX);

	// todo: insuranceFundAllocation technically not guaranteed to be in Insurance Fund
	const insuranceFundAllocation =
		perpMarket.insuranceClaim.quoteMaxInsurance.sub(
			perpMarket.insuranceClaim.quoteSettledInsurance
		);
	const ammFeePool = getTokenAmount(
		perpamm.feePool.scaledBalance,
		spotMarket,
		SpotBalanceType.DEPOSIT
	);
	return insuranceFundAllocation.add(ammFeePool);
}

export function calculateNetUserPnl(
	perpMarket: MarketAccount,
	oraclePriceData: OraclePriceData
): BN {
	const netUserPositionValue = perpamm.baseAssetAmountWithAmm
		.add(perpamm.baseAssetAmountWithUnsettledLp)
		.mul(oraclePriceData.price)
		.div(BASE_PRECISION)
		.div(PRICE_TO_QUOTE_PRECISION);

	const netUserCostBasis = perpamm.quoteAssetAmount
		.add(perpamm.quoteAssetAmountWithUnsettledLp)
		.add(perpamm.netUnsettledFundingPnl);

	const netUserPnl = netUserPositionValue.add(netUserCostBasis);

	return netUserPnl;
}

export function calculateNetUserPnlImbalance(
	perpMarket: MarketAccount,
	spotMarket: SpotMarketAccount,
	oraclePriceData: OraclePriceData,
	applyFeePoolDiscount = true
): BN {
	const netUserPnl = calculateNetUserPnl(perpMarket, oraclePriceData);

	const pnlPool = getTokenAmount(
		perpMarket.pnlPool.scaledBalance,
		spotMarket,
		SpotBalanceType.DEPOSIT
	);
	let feePool = getTokenAmount(
		perpamm.feePool.scaledBalance,
		spotMarket,
		SpotBalanceType.DEPOSIT
	);
	if (applyFeePoolDiscount) {
		feePool = feePool.div(new BN(5));
	}

	const imbalance = netUserPnl.sub(pnlPool.add(feePool));

	return imbalance;
}

export function calculateAvailablePerpLiquidity(
	market: MarketAccount,
	oraclePriceData: OraclePriceData,
	dlob: DLOB,
	slot: number
): { bids: BN; asks: BN } {
	let [bids, asks] = calculateMarketOpenBidAsk(
		amm.baseAssetReserve,
		amm.minBaseAssetReserve,
		amm.maxBaseAssetReserve,
		amm.orderStepSize
	);

	asks = asks.abs();

	for (const bid of dlob.getRestingLimitBids(
		market.marketIndex,
		slot,
		MarketType.PERP,
		oraclePriceData
	)) {
		bids = bids.add(
			bid.order.baseAssetAmount.sub(bid.order.baseAssetAmountFilled)
		);
	}

	for (const ask of dlob.getRestingLimitAsks(
		market.marketIndex,
		slot,
		MarketType.PERP,
		oraclePriceData
	)) {
		asks = asks.add(
			ask.order.baseAssetAmount.sub(ask.order.baseAssetAmountFilled)
		);
	}

	return {
		bids: bids,
		asks: asks,
	};
}

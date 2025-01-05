import {
	Keypair,
	PublicKey,
	Transaction,
	VersionedTransaction,
} from '@solana/web3.js';
import { BN, ZERO } from '.';

// Utility type which lets you denote record with values of type A mapped to a record with the same keys but values of type B
export type MappedRecord<A extends Record<string, unknown>, B> = {
	[K in keyof A]: B;
};

// # Utility Types / Enums / Constants

export enum ExchangeStatus {
	ACTIVE = 0,
	DEPOSIT_PAUSED = 1,
	WITHDRAW_PAUSED = 2,
	AMM_PAUSED = 4,
	LIQ_PAUSED = 8,
	PAUSED = 127,
}

export class MarketStatus {
	static readonly INITIALIZED = { initialized: {} };
	static readonly ACTIVE = { active: {} };
	static readonly REDUCE_ONLY = { reduceOnly: {} };
	static readonly SETTLEMENT = { settlement: {} };
	static readonly DELISTED = { delisted: {} };
}

export class VaultStatus {
	static readonly ACTIVE = { active: {} };
	static readonly BEING_LIQUIDATED = { beingLiquidated: {} };
	static readonly BANKRUPT = { bankrupt: {} };
	static readonly REDUCE_ONLY = { reduceOnly: {} };
}

export enum VaultOperation {
	CREATE = 1,
	DEPOSIT = 2,
	WITHDRAW = 4,
	LEND = 8,
	TRANSFER = 16,
	DELETE = 32,
	LIQUIDATION = 64,
}

export enum InsuranceFundOperation {
	INIT = 1,
	ADD = 2,
	REQUEST_REMOVE = 4,
	REMOVE = 8,
}

export enum UserStatus {
	BEING_LIQUIDATED = 1,
	BANKRUPT = 2,
	REDUCE_ONLY = 4,
}

export enum IndexVisibility {
	PRIVATE = 0,
	PUBLIC = 1,
}

export class SyntheticTier {
	static readonly A = { a: {} };
	static readonly B = { b: {} };
	static readonly C = { c: {} };
	static readonly SPECULATIVE = { speculative: {} };
	static readonly HIGHLY_SPECULATIVE = { highlySpeculative: {} };
	static readonly ISOLATED = { isolated: {} };
}

// export class SwapDirection {
// 	static readonly ADD = { add: {} };
// 	static readonly REMOVE = { remove: {} };
// }

export class SpotBalanceType {
	static readonly DEPOSIT = { deposit: {} };
	static readonly BORROW = { borrow: {} };
}

export class OrderDirection {
	static readonly BUY = { buy: {} };
	static readonly SELL = { sell: {} };
}

export class DepositDirection {
	static readonly DEPOSIT = { deposit: {} };
	static readonly WITHDRAW = { withdraw: {} };
}

export class OracleSource {
	static readonly PYTH = { pyth: {} };
	static readonly PYTH_1K = { pyth1K: {} };
	static readonly PYTH_1M = { pyth1M: {} };
	static readonly PYTH_PULL = { pythPull: {} };
	static readonly PYTH_1K_PULL = { pyth1KPull: {} };
	static readonly PYTH_1M_PULL = { pyth1MPull: {} };
	static readonly SWITCHBOARD = { switchboard: {} };
	static readonly QUOTE_ASSET = { quoteAsset: {} };
	static readonly PYTH_STABLE_COIN = { pythStableCoin: {} };
	static readonly PYTH_STABLE_COIN_PULL = { pythStableCoinPull: {} };
	static readonly SWITCHBOARD_ON_DEMAND = { switchboardOnDemand: {} };
}

export declare type MarketTypeStr = 'synth' | 'index';
export class MarketType {
	static readonly SYNTH = { synth: {} };
	static readonly INDEX = { index: {} };
}

export class DepositExplanation {
	static readonly NONE = { none: {} };
	static readonly TRANSFER = { transfer: {} };
	static readonly BORROW = { borrow: {} };
	static readonly REPAY_BORROW = { repayBorrow: {} };
}

export class StakeAction {
	static readonly STAKE = { stake: {} };
	static readonly UNSTAKE_REQUEST = { unstakeRequest: {} };
	static readonly UNSTAKE_CANCEL_REQUEST = { unstakeCancelRequest: {} };
	static readonly UNSTAKE = { unstake: {} };
	static readonly UNSTAKE_TRANSFER = { unstakeTransfer: {} };
	static readonly STAKE_TRANSFER = { stakeTransfer: {} };
}

export function isVariant(object: unknown, type: string) {
	return object.hasOwnProperty(type);
}

export function isOneOfVariant(object: unknown, types: string[]) {
	return types.reduce((result, type) => {
		return result || object.hasOwnProperty(type);
	}, false);
}

export function getVariant(object: unknown): string {
	return Object.keys(object)[0];
}

export enum TradeSide {
	None = 0,
	Buy = 1,
	Sell = 2,
}

export type CandleResolution =
	| '1'
	| '5'
	| '15'
	| '60'
	| '240'
	| 'D'
	| 'W'
	| 'M';

export type NewUserRecord = {
	ts: BN;
	userAuthority: PublicKey;
	user: PublicKey;
	subAccountId: number;
	name: number[];
	referrer: PublicKey;
};

export type DepositRecord = {
	ts: BN;
	userAuthority: PublicKey;
	user: PublicKey;
	direction: {
		deposit?: any;
		withdraw?: any;
	};
	marketIndex: number;
	vaultIndex: number;
	amount: BN;
	oraclePrice: BN;
	marketDepositBalance: BN;
	marketWithdrawBalance: BN;
	marketCumulativeDepositInterest: BN;
	marketCumulativeBorrowInterest: BN;
	totalDepositsAfter: BN;
	totalWithdrawsAfter: BN;
	depositRecordId: BN;
	explanation: DepositExplanation;
	transferUser?: PublicKey;
};

export declare type InsuranceFundRecord = {
	ts: BN;
	userIfFactor: number;
	totalIfFactor: number;
	vaultAmountBefore: BN;
	insuranceVaultAmountBefore: BN;
	totalIfSharesBefore: BN;
	totalIfSharesAfter: BN;
	amount: BN;
};

export declare type InsuranceFundStakeRecord = {
	ts: BN;
	userAuthority: PublicKey;
	action: StakeAction;
	amount: BN;
	insuranceVaultAmountBefore: BN;
	ifSharesBefore: BN;
	userIfSharesBefore: BN;
	totalIfSharesBefore: BN;
	ifSharesAfter: BN;
	userIfSharesAfter: BN;
	totalIfSharesAfter: BN;
};

export type LPRecord = {
	ts: BN;
	user: PublicKey;
	action: LPAction;
	nShares: BN;
	marketIndex: number;
	deltaBaseAssetAmount: BN;
	deltaQuoteAssetAmount: BN;
	pnl: BN;
};

export class LPAction {
	static readonly ADD_LIQUIDITY = { addLiquidity: {} };
	static readonly REMOVE_LIQUIDITY = { removeLiquidity: {} };
}

export type LiquidationRecord = {
	ts: BN;
	user: PublicKey;
	liquidator: PublicKey;
	liquidationType: LiquidationType;
	marginRequirement: BN;
	totalCollateral: BN;
	marginFreed: BN;
	liquidationId: number;
	bankrupt: boolean;
	canceledOrderIds: BN[];
	liquidateVault: LiquidateVaultRecord;
	bankruptcy: VaultBankruptcyRecord;
};

export class LiquidationType {
	static readonly LIQUIDATE_VAULT = { liquidateVault: {} };
	static readonly VAULT_BANKRUPTCY = {
		vaultBankruptcy: {},
	};
}

export type LiquidateVaultRecord = {
	vaultIndex: number;
	marketIndex: number;
	oraclePrice: BN;
	baseAssetAmount: BN;
	quoteAssetAmount: BN;
	lpShares: BN;
	userOrderId: BN;
	liquidatorOrderId: BN;
	fillRecordId: BN;
	liquidatorFee: BN;
	ifFee: BN;
};

export type VaultBankruptcyRecord = {
	vaultIndex: number;
	marketIndex: number;
	ifPayment: BN;
	clawbackUser: PublicKey | null;
	clawbackUserPayment: BN | null;
	cumulativeFundingRateDelta: BN;
	// borrowAmount: BN;
	// cumulativeDepositInterestDelta: BN;
};

export type SwapRecord = {
	ts: BN;
	user: PublicKey;
	amountOut: BN;
	amountIn: BN;
	outMarketIndex: number;
	inMarketIndex: number;
	outOraclePrice: BN;
	inOraclePrice: BN;
	fee: BN;
};

export type SpotMarketVaultDepositRecord = {
	ts: BN;
	marketIndex: number;
	depositBalance: BN;
	cumulativeDepositInterestBefore: BN;
	cumulativeDepositInterestAfter: BN;
	depositTokenAmountBefore: BN;
	amount: BN;
};

export type StateAccount = {
	admin: PublicKey;
	signer: PublicKey;
	signerNonce: number;

	oracleGuardRails: OracleGuardRails;
	emergencyOracles: any[];

	exchangeStatus: number;
	numberOfMarkets: number;
	numberOfVaults: number;

	insuranceFund: PublicKey;
	totalDebtCeiling: BN;

	maxInitializeUserFee: number;
	numberOfAuthorities: BN;
	numberOfSubAccounts: BN;
	maxNumberOfSubAccounts: number;

	liquidationMarginBufferRatio: number;
	liquidationDuration: number;
	initialPctToLiquidate: number;
};

// TODO: not all these need to be BN
export type InsuranceFundAccount = {
	pubkey: PublicKey;
	authority: PublicKey;
	vault: PublicKey;
	totalShares: BN;
	userShares: BN;
	sharesBase: BN;
	unstakingPeriod: BN;
	lastRevenueSettleTs: BN;
	revenueSettlePeriod: BN;
	totalFactor: BN;
	userFactor: BN;
	maxInsurance: BN;
	pausedOperations: number;
};

export type SynthMarketAccount = {
	pubkey: PublicKey;
	marketIndex: number;
	name: number[];
	status: MarketStatus;
	syntheticTier: SyntheticTier;
	pausedOperations: number;
	numberOfUsers: number;

	oracle: PublicKey;
	oracleSource: OracleSource;
	// historicalOracleData: HistoricalOracleData;
	// historicalIndexData: HistoricalIndexData;

	token_mint_collateral: PublicKey;
	token_vault_synthetic: PublicKey;
	token_vault_collateral: PublicKey;

	liquidation_penalty: number;
	liquidatorFee: number;
	ifLiquidationFee: number;
	marginRatioInitial: number;
	marginRatioMaintenance: number;
	imfFactor: number;
	debtCeiling: BN;
	debtFloor: number;
	collateral_lending_utilization: BN;

	amm: AMM;

	insuranceClaim: {
		revenueWithdrawSinceLastSettle: BN;
		maxRevenueWithdrawPerPeriod: BN;
		lastRevenueWithdrawTs: BN;
		quoteSettledInsurance: BN;
		quoteMaxInsurance: BN;
	};

	total_gov_token_inflation: BN;

	collateral_action_config: {};

	outstandingDebt: BN;
	protocolDebt: BN;

	expiryTs: BN;
	expiryPrice: BN;
};

export type IndexAsset = {
	mint: PublicKey;
	vault: PublicKey;
	marketIndex: number;
	weight: number;
	lastUpdatedTs: BN;
};

export type IndexMarketAccount = {
	pubkey: PublicKey;
	marketIndex: number;
	name: number[];
	status: MarketStatus;
	syntheticTier: SyntheticTier;
	pausedOperations: number;
	numberOfUsers: number;

	oracle: PublicKey;
	oracleSource: OracleSource;
	historicalOracleData: HistoricalOracleData;

	token_mint_collateral: PublicKey;
	token_vault_synthetic: PublicKey;
	token_vault_collateral: PublicKey;

	assets: IndexAsset[];
	visibility: IndexVisibility;
	whitelist: PublicKey[];

	expense_ratio: number;
	revenue_share: number;
	protocol_fee_owed: number;
	manager_fee_owed: number;
	referral_fee_owed: number;
	total_fees: number;

	expiryTs: BN;
	expiryPrice: BN;

	rebalancedTs: BN;
	updatedTs: BN;
};

export type HistoricalOracleData = {
	lastOraclePrice: BN;
	lastOracleDelay: BN;
	lastOracleConf: BN;
	lastOraclePriceTwap: BN;
	lastOraclePriceTwap5Min: BN;
	lastOraclePriceTwapTs: BN;
};

export type PoolBalance = {
	scaledBalance: BN;
	marketIndex: number;
};

export type AMMRewardInfo = {
	mint: PublicKey;
	vault: PublicKey;
	authority: PublicKey;
	emissionsPerSecondX64: BN;
	growthGlobalX64: BN;
};

export type AMM = {
	vault_balance_authority: PublicKey;

	token_mint_synthetic: PublicKey;
	token_mint_quote: PublicKey;

	token_vault_synthetic: PublicKey;
	token_vault_quote: PublicKey;

	oracle: PublicKey;
	oracleSource: OracleSource;
	historicalOracleData: HistoricalOracleData;
	lastOracleConfPct: BN;
	last_oracle_valid: boolean;
	last_oracle_normalised_price: BN;
	lastOracleReservePriceSpreadPct: BN;
	oracle_std: BN;

	max_price_deviance: number;
	liquidity_to_volume_multiplier: number;

	tickSpacing: number;
	tickSpacingSeed: number[];
	tickCurrentIndex: number;
	liquidity: BN;
	sqrtPrice: BN;

	feeRate: number;
	protocolFeeRate: number;
	ifFeeRate: number;

	feeGrowthGlobalSynthetic: BN;
	feeGrowthGlobalQuote: BN;

	protocolFeeOwedSynthetic: BN;
	protocolFeeOwedQuote: BN;

	rewardLastUpdatedTimestamp: BN;
	rewardInfos: AMMRewardInfo[];
};

// # User Account Types
export type Position = {
	scaledBalance: BN;
	cumulativeDeposits: BN;
	marketIndex: number;
};

export type Schedule = {
	market_type: MarketType;
	amm: PublicKey;
	base_asset_amount_per_interval: BN;
	direction: OrderDirection;
	active: boolean;
	interval_seconds: BN;
	total_orders: number;
	min_price: number;
	max_price: number;
	executed_orders: number;
	total_executed: BN;
	last_updated_ts: BN;
	last_order_ts: BN;
};

export type ScheduleParams = {
	marketType: MarketType;
	direction: OrderDirection;
	baseAssetAmount: BN;
	marketIndex: number;
	minPrice: BN | null;
	maxPrice: BN | null;
};

export type NecessaryScheduleParams = {
	marketIndex: number;
	baseAssetAmount: BN;
	direction: OrderDirection;
};

export type OptionalScheduleParams = {
	[Property in keyof ScheduleParams]?: ScheduleParams[Property];
} & NecessaryScheduleParams;

export type ModifyScheduleParams = {
	[Property in keyof ScheduleParams]?: ScheduleParams[Property] | null;
};

export const DefaultScheduleParams: ScheduleParams = {
	marketType: MarketType.SYNTH,
	direction: OrderDirection.BUY,
	baseAssetAmount: ZERO,
	marketIndex: 0,
	minPrice: null,
	maxPrice: null,
};

export type UserStatsAccount = {
	numberOfSubAccounts: number;
	numberOfSubAccountsCreated: number;
	makerVolume30D: BN;
	takerVolume30D: BN;
	lastMakerVolume30DTs: BN;
	lastTakerVolume30DTs: BN;
	fees: {
		totalFeePaid: BN;
		totalFeeRebate: BN;
		totalTokenDiscount: BN;
		totalRefereeDiscount: BN;
		totalReferrerReward: BN;
		current_epoch_referrer_reward: BN;
	};
	referrer: PublicKey;
	isReferrer: boolean;
	authority: PublicKey;
	ifStakedQuoteAssetAmount: BN;

	ifStakedGovTokenAmount: BN;
};

export type UserAccount = {
	authority: PublicKey;
	delegate: PublicKey;
	name: number[];
	subAccountId: number;
	positions: Position[];
	indexes: number[];
	schedules: Schedule[];
	scheduleStreak: number;
	status: number;
	nextLiquidationId: number;
	maxMarginRatio: number;
	totalDeposits: BN;
	totalWithdraws: BN;
	liquidationMarginFreed: BN;
	lastActiveSlot: BN;
	idle: boolean;
};

export type ReferrerInfo = {
	referrer: PublicKey;
	referrerStats: PublicKey;
};

type ExactType<T> = Pick<T, keyof T>;

export type BaseTxParams = ExactType<{
	computeUnits?: number;
	computeUnitsPrice?: number;
}>;

export type ProcessingTxParams = {
	useSimulatedComputeUnits?: boolean;
	computeUnitsBufferMultiplier?: number;
	useSimulatedComputeUnitsForCUPriceCalculation?: boolean;
	getCUPriceFromComputeUnits?: (computeUnits: number) => number;
	lowerBoundCu?: number;
};

export type TxParams = BaseTxParams & ProcessingTxParams;

export class SwapReduceOnly {
	static readonly In = { in: {} };
	static readonly Out = { out: {} };
}

// # Misc Types
export interface IWallet {
	signTransaction(tx: Transaction): Promise<Transaction>;
	signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
	publicKey: PublicKey;
	payer?: Keypair;
}
export interface IVersionedWallet {
	signVersionedTransaction(
		tx: VersionedTransaction
	): Promise<VersionedTransaction>;
	signAllVersionedTransactions(
		txs: VersionedTransaction[]
	): Promise<VersionedTransaction[]>;
	publicKey: PublicKey;
	payer?: Keypair;
}

export type FeeStructure = {
	feeTiers: FeeTier[];
	fillerRewardStructure: OrderFillerRewardStructure;
	flatFillerFee: BN;
	referrerRewardEpochUpperBound: BN;
};

export type FeeTier = {
	feeNumerator: number;
	feeDenominator: number;
	makerRebateNumerator: number;
	makerRebateDenominator: number;
	referrerRewardNumerator: number;
	referrerRewardDenominator: number;
	refereeFeeNumerator: number;
	refereeFeeDenominator: number;
};

export type OracleGuardRails = {
	priceDivergence: {
		markOraclePercentDivergence: BN;
		oracleTwap5MinPercentDivergence: BN;
	};
	validity: {
		slotsBeforeStaleForAmm: BN;
		slotsBeforeStaleForMargin: BN;
		confidenceIntervalMaxSize: BN;
		tooVolatileRatio: BN;
	};
};

export type MarginCategory = 'Initial' | 'Maintenance';

export type InsuranceFundStake = {
	costBasis: BN;

	marketIndex: number;
	authority: PublicKey;

	ifShares: BN;
	ifBase: BN;

	lastWithdrawRequestShares: BN;
	lastWithdrawRequestValue: BN;
	lastWithdrawRequestTs: BN;
};

export type ReferrerNameAccount = {
	name: number[];
	user: PublicKey;
	authority: PublicKey;
	userStats: PublicKey;
};

export type MarketExtendedInfo = {
	marketIndex: number;
	/**
	 * Min order size measured in base asset, using base precision
	 */
	minOrderSize: BN;
	/**
	 * Margin maintenance percentage, using margin precision (1e4)
	 */
	marginMaintenance: number;
	/**
	 * Max insurance available, measured in quote asset, using quote preicision
	 */
	availableInsurance: BN;
	/**
	 * Pnl pool available, this is measured in quote asset, using quote precision.
	 * Should be generated by using getTokenAmount and passing in the scaled balance of the base asset + quote spot account
	 */
	pnlPoolValue: BN;
	syntheticTier: SyntheticTier;
};

export type HealthComponents = {
	deposits: HealthComponent[];
	borrows: HealthComponent[];
	vaultPositions: HealthComponent[];
};

export type HealthComponent = {
	marketIndex: number;
	size: BN;
	value: BN;
	weight: BN;
	weightedValue: BN;
};

export interface NormalClientMetricsEvents {
	txSigned: SignedTxData[];
	preTxSigned: void;
}

export type SignedTxData = {
	txSig: string;
	signedTx: Transaction | VersionedTransaction;
	lastValidBlockHeight?: number;
	blockHash: string;
};

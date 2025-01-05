import {
	PublicKey,
	SystemProgram,
	SYSVAR_RENT_PUBKEY,
	TransactionInstruction,
	TransactionSignature,
} from '@solana/web3.js';
import {
	FeeStructure,
	OracleGuardRails,
	OracleSource,
	ExchangeStatus,
	MarketStatus,
	SyntheticTier,
} from './types';
import { DEFAULT_MARKET_NAME, encodeName } from './userName';
import { BN } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import {
	getNormalStateAccountPublicKeyAndNonce,
	getVaultPublicKey,
	getMarketPublicKey,
	getInsuranceFundVaultPublicKey,
	getProtocolIfSharesTransferConfigPublicKey,
	getPythPullOraclePublicKey,
	getUserStatsAccountPublicKey,
	getInsuranceFundPublicKey,
} from './addresses/pda';
import { squareRootBN } from './math/utils';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { NormalClient } from './normalClient';
import {
	PEG_PRECISION,
	QUOTE_SPOT_MARKET_INDEX,
	ZERO,
	ONE,
	BASE_PRECISION,
	PRICE_PRECISION,
} from './constants/numericConstants';
import { calculateTargetPriceTrade } from './math/trade';
import { calculateAmmReservesAfterSwap, getSwapDirection } from './math/amm';
import { NORMAL_ORACLE_RECEIVER_ID } from './config';
import { getFeedIdUint8Array } from './util/pythPullOracleUtils';

export class AdminClient extends NormalClient {
	public async initialize(
		usdcMint: PublicKey,
		_adminControlsPrices: boolean
	): Promise<[TransactionSignature]> {
		const stateAccountRPCResponse = await this.connection.getParsedAccountInfo(
			await this.getStatePublicKey()
		);
		if (stateAccountRPCResponse.value !== null) {
			throw new Error('Clearing house already initialized');
		}

		const [normalStatePublicKey] = await getNormalStateAccountPublicKeyAndNonce(
			this.program.programId
		);

		const initializeIx = await this.program.instruction.initialize({
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: normalStatePublicKey,
				quoteAssetMint: usdcMint,
				rent: SYSVAR_RENT_PUBKEY,
				normalSigner: this.getSignerPublicKey(),
				systemProgram: anchor.web3.SystemProgram.programId,
				tokenProgram: TOKEN_PROGRAM_ID,
			},
		});

		const tx = await this.buildTransaction(initializeIx);

		const { txSig } = await super.sendTransaction(tx, [], this.opts);

		return [txSig];
	}

	//    ________  ___  ___  _____  ___  ___________  __    __
	//   /"       )|"  \/"  |(\"   \|"  \("     _   ")/" |  | "\
	//  (:   \___/  \   \  / |.\\   \    |)__/  \\__/(:  (__)  :)
	//   \___  \     \\  \/  |: \.   \\  |   \\_ /    \/      \/
	//    __/  \\    /   /   |.  \    \. |   |.  |    //  __  \\
	//   /" \   :)  /   /    |    \    \ |   \:  |   (:  (  )  :)
	//  (_______/  |___/      \___|\____\)    \__|    \__|  |__/
	//

	public async initializeMarket(
		marketIndex: number,
		priceOracle: PublicKey,

		oracleSource: OracleSource = OracleSource.PYTH,
		syntheticTier: SyntheticTier = SyntheticTier.SPECULATIVE,
		marginRatioInitial = 2000,
		marginRatioMaintenance = 500,
		liquidatorFee = 0,
		ifLiquidatorFee = 10000,
		imfFactor = 0,

		maxRevenueWithdrawPerPeriod = ZERO,
		quoteMaxInsurance = ZERO,

		name = DEFAULT_MARKET_NAME,

		// AMM
		tickSpacing = 0,
		initialSqrtPrice = 0,
		feeRate = 0,
		protocolFeeRate = 0
	): Promise<TransactionSignature> {
		const currentMarketIndex = this.getStateAccount().numberOfMarkets;

		const initializeMarketIx = await this.getInitializeMarketIx(
			marketIndex,
			priceOracle,
			oracleSource,
			contractTier,
			marginRatioInitial,
			marginRatioMaintenance,
			liquidatorFee,
			ifLiquidatorFee,
			imfFactor,
			maxRevenueWithdrawPerPeriod,
			quoteMaxInsurance,
			name,

			tickSpacing,
			initialSqrtPrice,
			feeRate,
			protocolFeeRate
		);
		const tx = await this.buildTransaction(initializeMarketIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		while (this.getStateAccount().numberOfMarkets <= currentMarketIndex) {
			await this.fetchAccounts();
		}

		await this.accountSubscriber.addMarket(marketIndex);
		await this.accountSubscriber.addOracle({
			source: oracleSource,
			publicKey: priceOracle,
		});
		await this.accountSubscriber.setOracleMap();

		return txSig;
	}

	public async getInitializeMarketIx(
		marketIndex: number,
		priceOracle: PublicKey,
		oracleSource: OracleSource = OracleSource.PYTH,
		syntheticTier: SyntheticTier = SyntheticTier.SPECULATIVE,
		marginRatioInitial = 2000,
		marginRatioMaintenance = 500,
		liquidatorFee = 0,
		ifLiquidatorFee = 10000,
		imfFactor = 0,
		activeStatus = true,
		maxRevenueWithdrawPerPeriod = ZERO,
		quoteMaxInsurance = ZERO,

		ifLiquidationFee = 0,

		ifTotalFactor = 0,

		name = DEFAULT_MARKET_NAME
	): Promise<TransactionInstruction> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		const nameBuffer = encodeName(name);
		return await this.program.instruction.initializeMarket(
			marketIndex,
			oracleSource,
			contractTier,
			marginRatioInitial,
			marginRatioMaintenance,
			liquidatorFee,
			ifLiquidatorFee,
			imfFactor,
			activeStatus,

			maxRevenueWithdrawPerPeriod,
			quoteMaxInsurance,

			nameBuffer,
			{
				accounts: {
					state: await this.getStatePublicKey(),
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					oracle: priceOracle,
					market: marketPublicKey,
					rent: SYSVAR_RENT_PUBKEY,
					systemProgram: anchor.web3.SystemProgram.programId,
				},
			}
		);
	}

	// Market shutdown
	public async initializedMarketShutdown(
		marketIndex: number
	): Promise<TransactionSignature> {
		const initializeMarketShutdownIx = await this.getInitializeMarketShutdownIx(
			marketIndex
		);

		const tx = await this.buildTransaction(initializeMarketShutdownIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getInitializeMarketShutdownIx(
		marketIndex: number
	): Promise<TransactionInstruction> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.initializeMarketShutdown(
			marketIndex,
			{
				accounts: {
					state: await this.getStatePublicKey(),
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					market: marketPublicKey,
				},
			}
		);
	}

	// Delete Market

	public async deleteInitializedMarket(
		marketIndex: number
	): Promise<TransactionSignature> {
		const deleteInitializeMarketIx = await this.getDeleteInitializedMarketIx(
			marketIndex
		);

		const tx = await this.buildTransaction(deleteInitializeMarketIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getDeleteInitializedMarketIx(
		marketIndex: number
	): Promise<TransactionInstruction> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.deleteInitializedMarket(marketIndex, {
			accounts: {
				state: await this.getStatePublicKey(),
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				market: marketPublicKey,
			},
		});
	}

	// Vault

	public async initializeVault(
		mint: PublicKey,
		optimalUtilization: number,
		optimalRate: number,
		maxRate: number,
		oracle: PublicKey,
		oracleSource: OracleSource,
		initialAssetWeight: number,
		maintenanceAssetWeight: number,
		initialLiabilityWeight: number,
		maintenanceLiabilityWeight: number,
		imfFactor = 0,
		liquidatorFee = 0,
		ifLiquidationFee = 0,
		activeStatus = true,
		assetTier = AssetTier.COLLATERAL,
		scaleInitialAssetWeightStart = ZERO,
		withdrawGuardThreshold = ZERO,
		orderTickSize = ONE,
		orderStepSize = ONE,
		ifTotalFactor = 0,
		name = DEFAULT_MARKET_NAME,
		marketIndex?: number
	): Promise<TransactionSignature> {
		const spotMarketIndex =
			marketIndex ?? this.getStateAccount().numberOfSpotMarkets;

		const initializeIx = await this.getInitializeSpotMarketIx(
			mint,
			optimalUtilization,
			optimalRate,
			maxRate,
			oracle,
			oracleSource,
			initialAssetWeight,
			maintenanceAssetWeight,
			initialLiabilityWeight,
			maintenanceLiabilityWeight,
			imfFactor,
			liquidatorFee,
			ifLiquidationFee,
			activeStatus,
			assetTier,
			scaleInitialAssetWeightStart,
			withdrawGuardThreshold,
			orderTickSize,
			orderStepSize,
			ifTotalFactor,
			name,
			marketIndex
		);

		const tx = await this.buildTransaction(initializeIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		await this.accountSubscriber.addSpotMarket(spotMarketIndex);
		await this.accountSubscriber.addOracle({
			source: oracleSource,
			publicKey: oracle,
		});
		await this.accountSubscriber.setSpotOracleMap();

		return txSig;
	}

	public async getInitializeSpotMarketIx(
		mint: PublicKey,
		optimalUtilization: number,
		optimalRate: number,
		maxRate: number,
		oracle: PublicKey,
		oracleSource: OracleSource,
		initialAssetWeight: number,
		maintenanceAssetWeight: number,
		initialLiabilityWeight: number,
		maintenanceLiabilityWeight: number,
		imfFactor = 0,
		liquidatorFee = 0,
		ifLiquidationFee = 0,
		activeStatus = true,
		assetTier = AssetTier.COLLATERAL,
		scaleInitialAssetWeightStart = ZERO,
		withdrawGuardThreshold = ZERO,
		orderTickSize = ONE,
		orderStepSize = ONE,
		ifTotalFactor = 0,
		name = DEFAULT_MARKET_NAME,
		marketIndex?: number
	): Promise<TransactionInstruction> {
		const spotMarketIndex =
			marketIndex ?? this.getStateAccount().numberOfSpotMarkets;
		const spotMarket = await getSpotMarketPublicKey(
			this.program.programId,
			spotMarketIndex
		);

		const spotMarketVault = await getSpotMarketVaultPublicKey(
			this.program.programId,
			spotMarketIndex
		);

		const insuranceFundVault = await getInsuranceFundVaultPublicKey(
			this.program.programId
		);

		const tokenProgram = (await this.connection.getAccountInfo(mint)).owner;

		const nameBuffer = encodeName(name);
		const initializeIx = await this.program.instruction.initializeSpotMarket(
			optimalUtilization,
			optimalRate,
			maxRate,
			oracleSource,
			initialAssetWeight,
			maintenanceAssetWeight,
			initialLiabilityWeight,
			maintenanceLiabilityWeight,
			imfFactor,
			liquidatorFee,
			ifLiquidationFee,
			activeStatus,
			assetTier,
			scaleInitialAssetWeightStart,
			withdrawGuardThreshold,
			orderTickSize,
			orderStepSize,
			ifTotalFactor,
			nameBuffer,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					spotMarket,
					spotMarketVault,
					insuranceFundVault,
					normalSigner: this.getSignerPublicKey(),
					spotMarketMint: mint,
					oracle,
					rent: SYSVAR_RENT_PUBKEY,
					systemProgram: anchor.web3.SystemProgram.programId,
					tokenProgram,
				},
			}
		);

		return initializeIx;
	}

	public async deleteInitializedSpotMarket(
		marketIndex: number
	): Promise<TransactionSignature> {
		const deleteInitializeMarketIx =
			await this.getDeleteInitializedSpotMarketIx(marketIndex);

		const tx = await this.buildTransaction(deleteInitializeMarketIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getDeleteInitializedSpotMarketIx(
		marketIndex: number
	): Promise<TransactionInstruction> {
		const spotMarketPublicKey = await getSpotMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		const spotMarketVaultPublicKey = await getSpotMarketVaultPublicKey(
			this.program.programId,
			marketIndex
		);

		const insuranceFundVaultPublicKey = await getInsuranceFundVaultPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.deleteInitializedSpotMarket(
			marketIndex,
			{
				accounts: {
					state: await this.getStatePublicKey(),
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					spotMarket: spotMarketPublicKey,
					spotMarketVault: spotMarketVaultPublicKey,
					insuranceFundVault: insuranceFundVaultPublicKey,
					normalSigner: this.getSignerPublicKey(),
					tokenProgram: TOKEN_PROGRAM_ID,
				},
			}
		);
	}

	// ----

	public async moveAmmPrice(
		marketIndex: number,
		baseAssetReserve: BN,
		quoteAssetReserve: BN,
		sqrtK?: BN
	): Promise<TransactionSignature> {
		const moveAmmPriceIx = await this.getMoveAmmPriceIx(
			marketIndex,
			baseAssetReserve,
			quoteAssetReserve,
			sqrtK
		);

		const tx = await this.buildTransaction(moveAmmPriceIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getMoveAmmPriceIx(
		marketIndex: number,
		baseAssetReserve: BN,
		quoteAssetReserve: BN,
		sqrtK?: BN
	): Promise<TransactionInstruction> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		if (sqrtK == undefined) {
			sqrtK = squareRootBN(baseAssetReserve.mul(quoteAssetReserve));
		}

		return await this.program.instruction.moveAmmPrice(
			baseAssetReserve,
			quoteAssetReserve,
			sqrtK,
			{
				accounts: {
					state: await this.getStatePublicKey(),
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					market: marketPublicKey,
				},
			}
		);
	}

	public async recenterMarketAmm(
		marketIndex: number,
		pegMultiplier: BN,
		sqrtK: BN
	): Promise<TransactionSignature> {
		const recenterMarketAmmIx = await this.getRecenterMarketAmmIx(
			marketIndex,
			pegMultiplier,
			sqrtK
		);

		const tx = await this.buildTransaction(recenterMarketAmmIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getRecenterMarketAmmIx(
		marketIndex: number,
		pegMultiplier: BN,
		sqrtK: BN
	): Promise<TransactionInstruction> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.recenterMarketAmm(
			pegMultiplier,
			sqrtK,
			{
				accounts: {
					state: await this.getStatePublicKey(),
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					market: marketPublicKey,
				},
			}
		);
	}

	public async moveAmmToPrice(
		marketIndex: number,
		targetPrice: BN
	): Promise<TransactionSignature> {
		const moveAmmPriceIx = await this.getMoveAmmToPriceIx(
			marketIndex,
			targetPrice
		);

		const tx = await this.buildTransaction(moveAmmPriceIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getMoveAmmToPriceIx(
		marketIndex: number,
		targetPrice: BN
	): Promise<TransactionInstruction> {
		const market = this.getMarketAccount(marketIndex);

		const [direction, tradeSize, _] = calculateTargetPriceTrade(
			market,
			targetPrice,
			new BN(1000),
			'quote',
			undefined //todo
		);

		const [newQuoteAssetAmount, newBaseAssetAmount] =
			calculateAmmReservesAfterSwap(
				market.amm,
				'quote',
				tradeSize,
				getSwapDirection('quote', direction)
			);

		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.moveAmmPrice(
			newBaseAssetAmount,
			newQuoteAssetAmount,
			amm.sqrtK,
			{
				accounts: {
					state: await this.getStatePublicKey(),
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					market: marketPublicKey,
				},
			}
		);
	}

	public async updateMarketAmmOracleTwap(
		marketIndex: number
	): Promise<TransactionSignature> {
		const updateMarketAmmOracleTwapIx =
			await this.getUpdateMarketAmmOracleTwapIx(marketIndex);

		const tx = await this.buildTransaction(updateMarketAmmOracleTwapIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketAmmOracleTwapIx(
		marketIndex: number
	): Promise<TransactionInstruction> {
		const ammData = this.getMarketAccount(marketIndex).amm;
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.updateMarketAmmOracleTwap({
			accounts: {
				state: await this.getStatePublicKey(),
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				oracle: ammData.oracle,
				market: marketPublicKey,
			},
		});
	}

	public async resetMarketAmmOracleTwap(
		marketIndex: number
	): Promise<TransactionSignature> {
		const resetMarketAmmOracleTwapIx = await this.getResetMarketAmmOracleTwapIx(
			marketIndex
		);

		const tx = await this.buildTransaction(resetMarketAmmOracleTwapIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getResetMarketAmmOracleTwapIx(
		marketIndex: number
	): Promise<TransactionInstruction> {
		const ammData = this.getMarketAccount(marketIndex).amm;
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		return await this.program.instruction.resetMarketAmmOracleTwap({
			accounts: {
				state: await this.getStatePublicKey(),
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				oracle: ammData.oracle,
				market: marketPublicKey,
			},
		});
	}

	// public async depositIntoMarketFeePool(
	// 	marketIndex: number,
	// 	amount: BN,
	// 	sourceVault: PublicKey
	// ): Promise<TransactionSignature> {
	// 	const depositIntoMarketFeePoolIx =
	// 		await this.getDepositIntoMarketFeePoolIx(
	// 			marketIndex,
	// 			amount,
	// 			sourceVault
	// 		);

	// 	const tx = await this.buildTransaction(depositIntoMarketFeePoolIx);

	// 	const { txSig } = await this.sendTransaction(tx, [], this.opts);

	// 	return txSig;
	// }

	// public async getDepositIntoMarketFeePoolIx(
	// 	marketIndex: number,
	// 	amount: BN,
	// 	sourceVault: PublicKey
	// ): Promise<TransactionInstruction> {
	// 	const spotMarket = this.getQuoteSpotMarketAccount();

	// 	return await this.program.instruction.depositIntoMarketFeePool(amount, {
	// 		accounts: {
	// 			admin: this.isSubscribed
	// 				? this.getStateAccount().admin
	// 				: this.wallet.publicKey,
	// 			state: await this.getStatePublicKey(),
	// 			market: await getMarketPublicKey(
	// 				this.program.programId,
	// 				marketIndex
	// 			),
	// 			sourceVault,
	// 			normalSigner: this.getSignerPublicKey(),
	// 			quoteSpotMarket: spotMarket.pubkey,
	// 			spotMarketVault: spotMarket.vault,
	// 			tokenProgram: TOKEN_PROGRAM_ID,
	// 		},
	// 	});
	// }

	public async depositIntoSpotMarketVault(
		spotMarketIndex: number,
		amount: BN,
		sourceVault: PublicKey
	): Promise<TransactionSignature> {
		const depositIntoMarketFeePoolIx =
			await this.getDepositIntoSpotMarketVaultIx(
				spotMarketIndex,
				amount,
				sourceVault
			);

		const tx = await this.buildTransaction(depositIntoMarketFeePoolIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getDepositIntoSpotMarketVaultIx(
		spotMarketIndex: number,
		amount: BN,
		sourceVault: PublicKey
	): Promise<TransactionInstruction> {
		const spotMarket = this.getSpotMarketAccount(spotMarketIndex);

		const remainingAccounts = [];
		this.addTokenMintToRemainingAccounts(spotMarket, remainingAccounts);
		const tokenProgram = this.getTokenProgramForSpotMarket(spotMarket);
		return await this.program.instruction.depositIntoSpotMarketVault(amount, {
			accounts: {
				admin: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
				sourceVault,
				spotMarket: spotMarket.pubkey,
				spotMarketVault: spotMarket.vault,
				tokenProgram,
			},
			remainingAccounts,
		});
	}

	public async updateAdmin(admin: PublicKey): Promise<TransactionSignature> {
		const updateAdminIx = await this.getUpdateAdminIx(admin);

		const tx = await this.buildTransaction(updateAdminIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateAdminIx(
		admin: PublicKey
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateAdmin(admin, {
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
			},
		});
	}

	public async updateMarketMarginRatio(
		marketIndex: number,
		marginRatioInitial: number,
		marginRatioMaintenance: number
	): Promise<TransactionSignature> {
		const updateMarketMarginRatioIx = await this.getUpdateMarketMarginRatioIx(
			marketIndex,
			marginRatioInitial,
			marginRatioMaintenance
		);

		const tx = await this.buildTransaction(updateMarketMarginRatioIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketMarginRatioIx(
		marketIndex: number,
		marginRatioInitial: number,
		marginRatioMaintenance: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketMarginRatio(
			marginRatioInitial,
			marginRatioMaintenance,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
				},
			}
		);
	}

	public async updateMarketImfFactor(
		marketIndex: number,
		imfFactor: number,
		unrealizedPnlImfFactor: number
	): Promise<TransactionSignature> {
		const updateMarketImfFactorIx = await this.getUpdateMarketImfFactorIx(
			marketIndex,
			imfFactor,
			unrealizedPnlImfFactor
		);

		const tx = await this.buildTransaction(updateMarketImfFactorIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketImfFactorIx(
		marketIndex: number,
		imfFactor: number,
		unrealizedPnlImfFactor: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketImfFactor(
			imfFactor,
			unrealizedPnlImfFactor,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
				},
			}
		);
	}

	public async updateMarketName(
		marketIndex: number,
		name: string
	): Promise<TransactionSignature> {
		const updateMarketNameIx = await this.getUpdateMarketNameIx(
			marketIndex,
			name
		);

		const tx = await this.buildTransaction(updateMarketNameIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketNameIx(
		marketIndex: number,
		name: string
	): Promise<TransactionInstruction> {
		const nameBuffer = encodeName(name);
		return await this.program.instruction.updateMarketName(nameBuffer, {
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
				market: await getMarketPublicKey(this.program.programId, marketIndex),
			},
		});
	}

	public async updateInitialPctToLiquidate(
		initialPctToLiquidate: number
	): Promise<TransactionSignature> {
		const updateInitialPctToLiquidateIx =
			await this.getUpdateInitialPctToLiquidateIx(initialPctToLiquidate);

		const tx = await this.buildTransaction(updateInitialPctToLiquidateIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateInitialPctToLiquidateIx(
		initialPctToLiquidate: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateInitialPctToLiquidate(
			initialPctToLiquidate,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateLiquidationDuration(
		liquidationDuration: number
	): Promise<TransactionSignature> {
		const updateLiquidationDurationIx =
			await this.getUpdateLiquidationDurationIx(liquidationDuration);

		const tx = await this.buildTransaction(updateLiquidationDurationIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateLiquidationDurationIx(
		liquidationDuration: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateLiquidationDuration(
			liquidationDuration,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateLiquidationMarginBufferRatio(
		updateLiquidationMarginBufferRatio: number
	): Promise<TransactionSignature> {
		const updateLiquidationMarginBufferRatioIx =
			await this.getUpdateLiquidationMarginBufferRatioIx(
				updateLiquidationMarginBufferRatio
			);

		const tx = await this.buildTransaction(
			updateLiquidationMarginBufferRatioIx
		);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateLiquidationMarginBufferRatioIx(
		updateLiquidationMarginBufferRatio: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateLiquidationMarginBufferRatio(
			updateLiquidationMarginBufferRatio,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateProtocolIndexFee(
		protocolIndexFee: number
	): Promise<TransactionSignature> {
		const updateProtocolIndexFeeIx = await this.getUpdateProtocolIndexFeeIx(
			protocolIndexFee
		);

		const tx = await this.buildTransaction(updateProtocolIndexFeeIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateProtocolIndexFeeIx(
		protocolIndexFee: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateProtocolIndexFee(
			protocolIndexFee,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateOracleGuardRails(
		oracleGuardRails: OracleGuardRails
	): Promise<TransactionSignature> {
		const updateOracleGuardRailsIx = await this.getUpdateOracleGuardRailsIx(
			oracleGuardRails
		);

		const tx = await this.buildTransaction(updateOracleGuardRailsIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateOracleGuardRailsIx(
		oracleGuardRails: OracleGuardRails
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateOracleGuardRails(
			oracleGuardRails,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateStateSettlementDuration(
		settlementDuration: number
	): Promise<TransactionSignature> {
		const updateStateSettlementDurationIx =
			await this.getUpdateStateSettlementDurationIx(settlementDuration);

		const tx = await this.buildTransaction(updateStateSettlementDurationIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateStateSettlementDurationIx(
		settlementDuration: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateStateSettlementDuration(
			settlementDuration,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateStateMaxNumberOfSubAccounts(
		maxNumberOfSubAccounts: number
	): Promise<TransactionSignature> {
		const updateStateMaxNumberOfSubAccountsIx =
			await this.getUpdateStateMaxNumberOfSubAccountsIx(maxNumberOfSubAccounts);

		const tx = await this.buildTransaction(updateStateMaxNumberOfSubAccountsIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateStateMaxNumberOfSubAccountsIx(
		maxNumberOfSubAccounts: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateStateMaxNumberOfSubAccounts(
			maxNumberOfSubAccounts,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateStateMaxInitializeUserFee(
		maxInitializeUserFee: number
	): Promise<TransactionSignature> {
		const updateStateMaxInitializeUserFeeIx =
			await this.getUpdateStateMaxInitializeUserFeeIx(maxInitializeUserFee);

		const tx = await this.buildTransaction(updateStateMaxInitializeUserFeeIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateStateMaxInitializeUserFeeIx(
		maxInitializeUserFee: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateStateMaxInitializeUserFee(
			maxInitializeUserFee,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateSpotMarketRevenueSettlePeriod(
		spotMarketIndex: number,
		revenueSettlePeriod: BN
	): Promise<TransactionSignature> {
		const updateSpotMarketRevenueSettlePeriodIx =
			await this.getUpdateSpotMarketRevenueSettlePeriodIx(
				spotMarketIndex,
				revenueSettlePeriod
			);

		const tx = await this.buildTransaction(
			updateSpotMarketRevenueSettlePeriodIx
		);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateSpotMarketRevenueSettlePeriodIx(
		spotMarketIndex: number,
		revenueSettlePeriod: BN
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateSpotMarketRevenueSettlePeriod(
			revenueSettlePeriod,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					spotMarket: await getSpotMarketPublicKey(
						this.program.programId,
						spotMarketIndex
					),
				},
			}
		);
	}

	public async updateSpotMarketMaxTokenDeposits(
		spotMarketIndex: number,
		maxTokenDeposits: BN
	): Promise<TransactionSignature> {
		const updateSpotMarketMaxTokenDepositsIx =
			await this.getUpdateSpotMarketMaxTokenDepositsIx(
				spotMarketIndex,
				maxTokenDeposits
			);

		const tx = await this.buildTransaction(updateSpotMarketMaxTokenDepositsIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateSpotMarketMaxTokenDepositsIx(
		spotMarketIndex: number,
		maxTokenDeposits: BN
	): Promise<TransactionInstruction> {
		return this.program.instruction.updateSpotMarketMaxTokenDeposits(
			maxTokenDeposits,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					spotMarket: await getSpotMarketPublicKey(
						this.program.programId,
						spotMarketIndex
					),
				},
			}
		);
	}

	public async updateSpotMarketMaxTokenBorrows(
		spotMarketIndex: number,
		maxTokenBorrowsFraction: number
	): Promise<TransactionSignature> {
		const updateSpotMarketMaxTokenBorrowsIx =
			await this.getUpdateSpotMarketMaxTokenBorrowsIx(
				spotMarketIndex,
				maxTokenBorrowsFraction
			);

		const tx = await this.buildTransaction(updateSpotMarketMaxTokenBorrowsIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateSpotMarketMaxTokenBorrowsIx(
		spotMarketIndex: number,
		maxTokenBorrowsFraction: number
	): Promise<TransactionInstruction> {
		return this.program.instruction.updateSpotMarketMaxTokenBorrows(
			maxTokenBorrowsFraction,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					spotMarket: await getSpotMarketPublicKey(
						this.program.programId,
						spotMarketIndex
					),
				},
			}
		);
	}

	public async updateInsuranceFundUnstakingPeriod(
		insuranceWithdrawEscrowPeriod: BN
	): Promise<TransactionSignature> {
		const updateInsuranceFundUnstakingPeriodIx =
			await this.getUpdateInsuranceFundUnstakingPeriodIx(
				insuranceWithdrawEscrowPeriod
			);

		const tx = await this.buildTransaction(
			updateInsuranceFundUnstakingPeriodIx
		);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateInsuranceFundUnstakingPeriodIx(
		insuranceWithdrawEscrowPeriod: BN
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateInsuranceFundUnstakingPeriod(
			insuranceWithdrawEscrowPeriod,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					insuranceFund: await getInsuranceFundPublicKey(
						this.program.programId
					),
				},
			}
		);
	}

	public async updateMarketOracle(
		marketIndex: number,
		oracle: PublicKey,
		oracleSource: OracleSource
	): Promise<TransactionSignature> {
		const updateMarketOracleIx = await this.getUpdateMarketOracleIx(
			marketIndex,
			oracle,
			oracleSource
		);

		const tx = await this.buildTransaction(updateMarketOracleIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketOracleIx(
		marketIndex: number,
		oracle: PublicKey,
		oracleSource: OracleSource
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketOracle(
			oracle,
			oracleSource,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
					oracle: oracle,
				},
			}
		);
	}

	public async updateMarketExpiry(
		marketIndex: number,
		expiryTs: BN
	): Promise<TransactionSignature> {
		const updateMarketExpiryIx = await this.getUpdateMarketExpiryIx(
			marketIndex,
			expiryTs
		);
		const tx = await this.buildTransaction(updateMarketExpiryIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketExpiryIx(
		marketIndex: number,
		expiryTs: BN
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketExpiry(expiryTs, {
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
				market: await getMarketPublicKey(this.program.programId, marketIndex),
			},
		});
	}

	public async updateVaultOracle(
		vaultIndex: number,
		oracle: PublicKey,
		oracleSource: OracleSource
	): Promise<TransactionSignature> {
		const updateVaultOracleIx = await this.getUpdateVaultOracleIx(
			vaultIndex,
			oracle,
			oracleSource
		);

		const tx = await this.buildTransaction(updateVaultOracleIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateVaultOracleIx(
		vaultIndex: number,
		oracle: PublicKey,
		oracleSource: OracleSource
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateVaultOracle(
			oracle,
			oracleSource,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					vault: await getVaultPublicKey(this.program.programId, vaultIndex),
					oracle: oracle,
				},
			}
		);
	}

	public async updateIfPausedOperations(
		pausedOperations: number
	): Promise<TransactionSignature> {
		const updateIfStakingDisabledIx = await this.getUpdateIfPausedOperationsIx(
			pausedOperations
		);

		const tx = await this.buildTransaction(updateIfStakingDisabledIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateIfPausedOperationsIx(
		pausedOperations: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateIfPausedOperations(
			pausedOperations,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
				},
			}
		);
	}

	public async updateMarketStatus(
		marketIndex: number,
		marketStatus: MarketStatus
	): Promise<TransactionSignature> {
		const updateMarketStatusIx = await this.getUpdateMarketStatusIx(
			marketIndex,
			marketStatus
		);

		const tx = await this.buildTransaction(updateMarketStatusIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketStatusIx(
		marketIndex: number,
		marketStatus: MarketStatus
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketStatus(marketStatus, {
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
				market: await getMarketPublicKey(this.program.programId, marketIndex),
			},
		});
	}

	public async updateMarketPausedOperations(
		marketIndex: number,
		pausedOperations: number
	): Promise<TransactionSignature> {
		const updateMarketPausedOperationsIx =
			await this.getUpdateMarketPausedOperationsIx(
				marketIndex,
				pausedOperations
			);

		const tx = await this.buildTransaction(updateMarketPausedOperationsIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketPausedOperationsIx(
		marketIndex: number,
		pausedOperations: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketPausedOperations(
			pausedOperations,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
				},
			}
		);
	}

	public async updateMarketSyntheticTier(
		marketIndex: number,
		syntheticTier: SyntheticTier
	): Promise<TransactionSignature> {
		const updateMarketSyntheticTierIx =
			await this.getUpdateMarketSyntheticTierIx(marketIndex, syntheticTier);

		const tx = await this.buildTransaction(updateMarketSyntheticTierIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketSyntheticTierIx(
		marketIndex: number,
		syntheticTier: SyntheticTier
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketSyntheticTier(
			syntheticTier,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
				},
			}
		);
	}

	public async updateExchangeStatus(
		exchangeStatus: ExchangeStatus
	): Promise<TransactionSignature> {
		const updateExchangeStatusIx = await this.getUpdateExchangeStatusIx(
			exchangeStatus
		);

		const tx = await this.buildTransaction(updateExchangeStatusIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateExchangeStatusIx(
		exchangeStatus: ExchangeStatus
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateExchangeStatus(exchangeStatus, {
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
			},
		});
	}

	public async updateMarketDebtCeiling(
		marketIndex: number,
		debtCeiling: BN
	): Promise<TransactionSignature> {
		const updateMarketDebtCeilingIx = await this.getUpdateMarketDebtCeilingIx(
			marketIndex,
			debtCeiling
		);

		const tx = await this.buildTransaction(updateMarketDebtCeilingIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketDebtCeilingIx(
		marketIndex: number,
		debtCeiling: BN
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketDebtCeiling(debtCeiling, {
			accounts: {
				admin: this.isSubscribed
					? this.getStateAccount().admin
					: this.wallet.publicKey,
				state: await this.getStatePublicKey(),
				market: await getMarketPublicKey(this.program.programId, marketIndex),
			},
		});
	}

	public async updateMarketNumberOfUser(
		marketIndex: number,
		numberOfUsers?: number,
		numberOfUsersWithBase?: number
	): Promise<TransactionSignature> {
		const updatepMarketFeeAdjustmentIx =
			await this.getUpdateMarketNumberOfUsersIx(
				marketIndex,
				numberOfUsers,
				numberOfUsersWithBase
			);

		const tx = await this.buildTransaction(updatepMarketFeeAdjustmentIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketNumberOfUsersIx(
		marketIndex: number,
		numberOfUsers?: number,
		numberOfUsersWithBase?: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketNumberOfUsers(
			numberOfUsers,
			numberOfUsersWithBase,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
				},
			}
		);
	}

	public async updateMarketLiquidationFee(
		marketIndex: number,
		liquidatorFee: number,
		ifLiquidationFee: number
	): Promise<TransactionSignature> {
		const updateMarketLiquidationFeeIx =
			await this.getUpdateMarketLiquidationFeeIx(
				marketIndex,
				liquidatorFee,
				ifLiquidationFee
			);

		const tx = await this.buildTransaction(updateMarketLiquidationFeeIx);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateMarketLiquidationFeeIx(
		marketIndex: number,
		liquidatorFee: number,
		ifLiquidationFee: number
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateMarketLiquidationFee(
			liquidatorFee,
			ifLiquidationFee,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					market: await getMarketPublicKey(this.program.programId, marketIndex),
				},
			}
		);
	}

	public async initializeProtocolIfSharesTransferConfig(): Promise<TransactionSignature> {
		const initializeProtocolIfSharesTransferConfigIx =
			await this.getInitializeProtocolIfSharesTransferConfigIx();

		const tx = await this.buildTransaction(
			initializeProtocolIfSharesTransferConfigIx
		);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getInitializeProtocolIfSharesTransferConfigIx(): Promise<TransactionInstruction> {
		return await this.program.instruction.initializeProtocolIfSharesTransferConfig(
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					rent: SYSVAR_RENT_PUBKEY,
					systemProgram: anchor.web3.SystemProgram.programId,
					protocolIfSharesTransferConfig:
						getProtocolIfSharesTransferConfigPublicKey(this.program.programId),
				},
			}
		);
	}

	public async updateProtocolIfSharesTransferConfig(
		whitelistedSigners?: PublicKey[],
		maxTransferPerEpoch?: BN
	): Promise<TransactionSignature> {
		const updateProtocolIfSharesTransferConfigIx =
			await this.getUpdateProtocolIfSharesTransferConfigIx(
				whitelistedSigners,
				maxTransferPerEpoch
			);

		const tx = await this.buildTransaction(
			updateProtocolIfSharesTransferConfigIx
		);

		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getUpdateProtocolIfSharesTransferConfigIx(
		whitelistedSigners?: PublicKey[],
		maxTransferPerEpoch?: BN
	): Promise<TransactionInstruction> {
		return await this.program.instruction.updateProtocolIfSharesTransferConfig(
			whitelistedSigners || null,
			maxTransferPerEpoch,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					protocolIfSharesTransferConfig:
						getProtocolIfSharesTransferConfigPublicKey(this.program.programId),
				},
			}
		);
	}

	public async initializePythPullOracle(
		feedId: string
	): Promise<TransactionSignature> {
		const initializePythPullOracleIx = await this.getInitializePythPullOracleIx(
			feedId
		);
		const tx = await this.buildTransaction(initializePythPullOracleIx);
		const { txSig } = await this.sendTransaction(tx, [], this.opts);

		return txSig;
	}

	public async getInitializePythPullOracleIx(
		feedId: string
	): Promise<TransactionInstruction> {
		const feedIdBuffer = getFeedIdUint8Array(feedId);
		return await this.program.instruction.initializePythPullOracle(
			feedIdBuffer,
			{
				accounts: {
					admin: this.isSubscribed
						? this.getStateAccount().admin
						: this.wallet.publicKey,
					state: await this.getStatePublicKey(),
					systemProgram: SystemProgram.programId,
					priceFeed: getPythPullOraclePublicKey(
						this.program.programId,
						feedIdBuffer
					),
					pythSolanaReceiver: NORMAL_ORACLE_RECEIVER_ID,
				},
			}
		);
	}
}

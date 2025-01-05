import {
	AccountToPoll,
	DataAndSlot,
	DelistedMarketSetting,
	NormalClientAccountEvents,
	NormalClientAccountSubscriber,
	NotSubscribedError,
	OraclesToPoll,
} from './types';
import { Program } from '@coral-xyz/anchor';
import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import {
	MarketAccount,
	VaultAccount,
	StateAccount,
	UserAccount,
} from '../types';
import {
	getNormalStateAccountPublicKey,
	getMarketPublicKey,
	getVaultPublicKey,
} from '../addresses/pda';
import { BulkAccountLoader } from './bulkAccountLoader';
import { capitalize, findDelistedMarketsAndOracles } from './utils';
import { PublicKey } from '@solana/web3.js';
import { OracleInfo, OraclePriceData } from '../oracles/types';
import { OracleClientCache } from '../oracles/oracleClientCache';
import { QUOTE_ORACLE_PRICE_DATA } from '../oracles/quoteAssetOracleClient';
import { findAllMarketAndOracles } from '../config';

const ORACLE_DEFAULT_KEY = PublicKey.default.toBase58();

export class PollingNormalClientAccountSubscriber
	implements NormalClientAccountSubscriber
{
	isSubscribed: boolean;
	program: Program;
	marketIndexes: number[];
	vaultIndexes: number[];
	oracleInfos: OracleInfo[];
	oracleClientCache = new OracleClientCache();

	shouldFindAllMarketsAndOracles: boolean;

	eventEmitter: StrictEventEmitter<EventEmitter, NormalClientAccountEvents>;

	accountLoader: BulkAccountLoader;
	accountsToPoll = new Map<string, AccountToPoll>();
	oraclesToPoll = new Map<string, OraclesToPoll>();
	errorCallbackId?: string;

	state?: DataAndSlot<StateAccount>;
	market = new Map<number, DataAndSlot<MarketAccount>>();
	oracleMap = new Map<number, PublicKey>();
	oracleStringMap = new Map<number, string>();
	vault = new Map<number, DataAndSlot<VaultAccount>>();
	vaultOracleMap = new Map<number, PublicKey>();
	vaultOracleStringMap = new Map<number, string>();
	oracles = new Map<string, DataAndSlot<OraclePriceData>>();
	user?: DataAndSlot<UserAccount>;
	delistedMarketSetting: DelistedMarketSetting;

	private isSubscribing = false;
	private subscriptionPromise: Promise<boolean>;
	private subscriptionPromiseResolver: (val: boolean) => void;

	public constructor(
		program: Program,
		accountLoader: BulkAccountLoader,
		marketIndexes: number[],
		vaultIndexes: number[],
		oracleInfos: OracleInfo[],
		shouldFindAllMarketsAndOracles: boolean,
		delistedMarketSetting: DelistedMarketSetting
	) {
		this.isSubscribed = false;
		this.program = program;
		this.eventEmitter = new EventEmitter();
		this.accountLoader = accountLoader;
		this.marketIndexes = marketIndexes;
		this.vaultIndexes = vaultIndexes;
		this.oracleInfos = oracleInfos;
		this.shouldFindAllMarketsAndOracles = shouldFindAllMarketsAndOracles;
		this.delistedMarketSetting = delistedMarketSetting;
	}

	public async subscribe(): Promise<boolean> {
		if (this.isSubscribed) {
			return true;
		}

		if (this.isSubscribing) {
			return await this.subscriptionPromise;
		}

		this.isSubscribing = true;

		this.subscriptionPromise = new Promise((res) => {
			this.subscriptionPromiseResolver = res;
		});

		if (this.shouldFindAllMarketsAndOracles) {
			const { marketIndexes, vaultIndexes, oracleInfos } =
				await findAllMarketAndOracles(this.program);
			this.marketIndexes = marketIndexes;
			this.vaultIndexes = vaultIndexes;
			this.oracleInfos = oracleInfos;
		}

		await this.updateAccountsToPoll();
		this.updateOraclesToPoll();
		await this.addToAccountLoader();

		let subscriptionSucceeded = false;
		let retries = 0;
		while (!subscriptionSucceeded && retries < 5) {
			await this.fetch();
			subscriptionSucceeded = this.didSubscriptionSucceed();
			retries++;
		}

		if (subscriptionSucceeded) {
			this.eventEmitter.emit('update');
		}

		this.handleDelistedMarkets();

		await Promise.all([this.setOracleMap(), this.setVaultOracleMap()]);

		this.isSubscribing = false;
		this.isSubscribed = subscriptionSucceeded;
		this.subscriptionPromiseResolver(subscriptionSucceeded);

		return subscriptionSucceeded;
	}

	async updateAccountsToPoll(): Promise<void> {
		if (this.accountsToPoll.size > 0) {
			return;
		}

		const statePublicKey = await getNormalStateAccountPublicKey(
			this.program.programId
		);

		this.accountsToPoll.set(statePublicKey.toString(), {
			key: 'state',
			publicKey: statePublicKey,
			eventType: 'stateAccountUpdate',
		});

		await Promise.all([
			this.updateMarketAccountsToPoll(),
			this.updateVaultAccountsToPoll(),
		]);
	}

	async updateMarketAccountsToPoll(): Promise<boolean> {
		await Promise.all(
			this.marketIndexes.map((marketIndex) => {
				return this.addMarketAccountToPoll(marketIndex);
			})
		);
		return true;
	}

	async addMarketAccountToPoll(marketIndex: number): Promise<boolean> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		this.accountsToPoll.set(marketPublicKey.toString(), {
			key: 'market',
			publicKey: marketPublicKey,
			eventType: 'marketAccountUpdate',
			mapKey: marketIndex,
		});

		return true;
	}

	async updateVaultAccountsToPoll(): Promise<boolean> {
		await Promise.all(
			this.vaultIndexes.map(async (vaultIndex) => {
				await this.addVaultAccountToPoll(vaultIndex);
			})
		);

		return true;
	}

	async addVaultAccountToPoll(vaultIndex: number): Promise<boolean> {
		const vaultPublicKey = await getVaultPublicKey(
			this.program.programId,
			vaultIndex
		);

		this.accountsToPoll.set(vaultPublicKey.toString(), {
			key: 'vault',
			publicKey: vaultPublicKey,
			eventType: 'vaultAccountUpdate',
			mapKey: vaultIndex,
		});
		return true;
	}

	updateOraclesToPoll(): boolean {
		for (const oracleInfo of this.oracleInfos) {
			if (!oracleInfo.publicKey.equals(PublicKey.default)) {
				this.addOracleToPoll(oracleInfo);
			}
		}

		return true;
	}

	addOracleToPoll(oracleInfo: OracleInfo): boolean {
		this.oraclesToPoll.set(oracleInfo.publicKey.toString(), {
			publicKey: oracleInfo.publicKey,
			source: oracleInfo.source,
		});

		return true;
	}
	async addToAccountLoader(): Promise<void> {
		const accountPromises = [];
		for (const [_, accountToPoll] of this.accountsToPoll) {
			accountPromises.push(this.addAccountToAccountLoader(accountToPoll));
		}

		const oraclePromises = [];
		for (const [_, oracleToPoll] of this.oraclesToPoll) {
			oraclePromises.push(this.addOracleToAccountLoader(oracleToPoll));
		}

		await Promise.all([...accountPromises, ...oraclePromises]);

		this.errorCallbackId = this.accountLoader.addErrorCallbacks((error) => {
			this.eventEmitter.emit('error', error);
		});
	}

	async addAccountToAccountLoader(accountToPoll: AccountToPoll): Promise<void> {
		accountToPoll.callbackId = await this.accountLoader.addAccount(
			accountToPoll.publicKey,
			(buffer: Buffer, slot: number) => {
				if (!buffer) return;

				const account = this.program.account[
					accountToPoll.key
				].coder.accounts.decodeUnchecked(capitalize(accountToPoll.key), buffer);
				const dataAndSlot = {
					data: account,
					slot,
				};
				if (accountToPoll.mapKey != undefined) {
					this[accountToPoll.key].set(accountToPoll.mapKey, dataAndSlot);
				} else {
					this[accountToPoll.key] = dataAndSlot;
				}

				// @ts-ignore
				this.eventEmitter.emit(accountToPoll.eventType, account);
				this.eventEmitter.emit('update');

				if (!this.isSubscribed) {
					this.isSubscribed = this.didSubscriptionSucceed();
				}
			}
		);
	}

	async addOracleToAccountLoader(oracleToPoll: OraclesToPoll): Promise<void> {
		const oracleClient = this.oracleClientCache.get(
			oracleToPoll.source,
			this.program.provider.connection,
			this.program
		);

		oracleToPoll.callbackId = await this.accountLoader.addAccount(
			oracleToPoll.publicKey,
			(buffer: Buffer, slot: number) => {
				if (!buffer) return;

				const oraclePriceData =
					oracleClient.getOraclePriceDataFromBuffer(buffer);
				const dataAndSlot = {
					data: oraclePriceData,
					slot,
				};

				this.oracles.set(oracleToPoll.publicKey.toString(), dataAndSlot);

				this.eventEmitter.emit(
					'oraclePriceUpdate',
					oracleToPoll.publicKey,
					oraclePriceData
				);
				this.eventEmitter.emit('update');
			}
		);
	}

	public async fetch(): Promise<void> {
		await this.accountLoader.load();
		for (const [_, accountToPoll] of this.accountsToPoll) {
			const bufferAndSlot = this.accountLoader.getBufferAndSlot(
				accountToPoll.publicKey
			);

			if (!bufferAndSlot) {
				continue;
			}

			const { buffer, slot } = bufferAndSlot;

			if (buffer) {
				const account = this.program.account[
					accountToPoll.key
				].coder.accounts.decodeUnchecked(capitalize(accountToPoll.key), buffer);
				if (accountToPoll.mapKey != undefined) {
					this[accountToPoll.key].set(accountToPoll.mapKey, {
						data: account,
						slot,
					});
				} else {
					this[accountToPoll.key] = {
						data: account,
						slot,
					};
				}
			}
		}

		for (const [_, oracleToPoll] of this.oraclesToPoll) {
			const bufferAndSlot = this.accountLoader.getBufferAndSlot(
				oracleToPoll.publicKey
			);

			if (!bufferAndSlot) {
				continue;
			}

			const { buffer, slot } = bufferAndSlot;

			if (buffer) {
				const oracleClient = this.oracleClientCache.get(
					oracleToPoll.source,
					this.program.provider.connection,
					this.program
				);
				const oraclePriceData =
					oracleClient.getOraclePriceDataFromBuffer(buffer);
				this.oracles.set(oracleToPoll.publicKey.toString(), {
					data: oraclePriceData,
					slot,
				});
			}
		}
	}

	didSubscriptionSucceed(): boolean {
		if (this.state) return true;

		return false;
	}

	public async unsubscribe(): Promise<void> {
		for (const [_, accountToPoll] of this.accountsToPoll) {
			this.accountLoader.removeAccount(
				accountToPoll.publicKey,
				accountToPoll.callbackId
			);
		}

		for (const [_, oracleToPoll] of this.oraclesToPoll) {
			this.accountLoader.removeAccount(
				oracleToPoll.publicKey,
				oracleToPoll.callbackId
			);
		}

		this.accountLoader.removeErrorCallbacks(this.errorCallbackId);
		this.errorCallbackId = undefined;

		this.accountsToPoll.clear();
		this.oraclesToPoll.clear();
		this.isSubscribed = false;
	}

	async addVault(vaultIndex: number): Promise<boolean> {
		const vaultPublicKey = await getVaultPublicKey(
			this.program.programId,
			vaultIndex
		);

		if (this.accountsToPoll.has(vaultPublicKey.toString())) {
			return true;
		}

		await this.addVaultAccountToPoll(vaultIndex);

		const accountToPoll = this.accountsToPoll.get(vaultPublicKey.toString());

		await this.addAccountToAccountLoader(accountToPoll);
		this.setVaultOracleMap();
		return true;
	}

	async addMarket(marketIndex: number): Promise<boolean> {
		const marketPublicKey = await getMarketPublicKey(
			this.program.programId,
			marketIndex
		);

		if (this.accountsToPoll.has(marketPublicKey.toString())) {
			return true;
		}

		await this.addMarketAccountToPoll(marketIndex);
		const accountToPoll = this.accountsToPoll.get(marketPublicKey.toString());
		await this.addAccountToAccountLoader(accountToPoll);
		await this.setOracleMap();
		return true;
	}

	async addOracle(oracleInfo: OracleInfo): Promise<boolean> {
		if (
			oracleInfo.publicKey.equals(PublicKey.default) ||
			this.oracles.has(oracleInfo.publicKey.toBase58())
		) {
			return true;
		}

		const oracleString = oracleInfo.publicKey.toBase58();
		// this func can be called multiple times before the first pauseForOracleToBeAdded finishes
		// avoid adding to oraclesToPoll multiple time
		if (!this.oraclesToPoll.has(oracleString)) {
			this.addOracleToPoll(oracleInfo);
			const oracleToPoll = this.oraclesToPoll.get(oracleString);
			await this.addOracleToAccountLoader(oracleToPoll);
		}

		await this.pauseForOracleToBeAdded(3, oracleString);

		return true;
	}

	private async pauseForOracleToBeAdded(
		tries: number,
		oracle: string
	): Promise<void> {
		let i = 0;
		while (i < tries) {
			await new Promise((r) =>
				setTimeout(r, this.accountLoader.pollingFrequency)
			);
			if (this.accountLoader.bufferAndSlotMap.has(oracle)) {
				return;
			}
			i++;
		}
		console.log(`Pausing to find oracle ${oracle} failed`);
	}
	async setOracleMap() {
		const markets = this.getMarketAccountsAndSlots();
		const oraclePromises = [];
		for (const market of markets) {
			const marketAccount = market.data;
			const marketIndex = marketAccount.marketIndex;
			const oracle = marketAccount.amm.oracle;
			if (!this.oracles.has(oracle.toBase58())) {
				oraclePromises.push(
					this.addOracle({
						publicKey: oracle,
						source: marketAccount.amm.oracleSource,
					})
				);
			}
			this.oracleMap.set(marketIndex, oracle);
			this.oracleStringMap.set(marketIndex, oracle.toBase58());
		}
		await Promise.all(oraclePromises);
	}

	async setVaultOracleMap() {
		const vaults = this.getVaultAccountsAndSlots();
		const oraclePromises = [];
		for (const vault of vaults) {
			const vaultAccount = vault.data;
			const vaultIndex = vaultAccount.vaultIndex;
			const oracle = vaultAccount.oracle;
			if (!this.oracles.has(oracle.toBase58())) {
				oraclePromises.push(
					this.addOracle({
						publicKey: oracle,
						source: vaultAccount.oracleSource,
					})
				);
			}
			this.vaultOracleMap.set(vaultIndex, oracle);
			this.vaultOracleStringMap.set(vaultIndex, oracle.toBase58());
		}
		await Promise.all(oraclePromises);
	}

	handleDelistedMarkets(): void {
		if (this.delistedMarketSetting === DelistedMarketSetting.Subscribe) {
			return;
		}

		const { marketIndexes, oracles } = findDelistedMarketsAndOracles(
			this.getMarketAccountsAndSlots(),
			this.getVaultAccountsAndSlots()
		);

		for (const marketIndex of marketIndexes) {
			const marketPubkey = this.market.get(marketIndex).data.pubkey;
			const callbackId = this.accountsToPoll.get(
				marketPubkey.toBase58()
			).callbackId;
			this.accountLoader.removeAccount(marketPubkey, callbackId);
			if (this.delistedMarketSetting === DelistedMarketSetting.Discard) {
				this.market.delete(marketIndex);
			}
		}

		for (const oracle of oracles) {
			const callbackId = this.oraclesToPoll.get(oracle.toBase58()).callbackId;
			this.accountLoader.removeAccount(oracle, callbackId);
			if (this.delistedMarketSetting === DelistedMarketSetting.Discard) {
				this.oracles.delete(oracle.toBase58());
			}
		}
	}

	assertIsSubscribed(): void {
		if (!this.isSubscribed) {
			throw new NotSubscribedError(
				'You must call `subscribe` before using this function'
			);
		}
	}

	public getStateAccountAndSlot(): DataAndSlot<StateAccount> {
		this.assertIsSubscribed();
		return this.state;
	}

	public getMarketAccountAndSlot(
		marketIndex: number
	): DataAndSlot<MarketAccount> | undefined {
		return this.market.get(marketIndex);
	}

	public getMarketAccountsAndSlots(): DataAndSlot<MarketAccount>[] {
		return Array.from(this.market.values());
	}

	public getVaultAccountAndSlot(
		vaultIndex: number
	): DataAndSlot<VaultAccount> | undefined {
		return this.vault.get(vaultIndex);
	}

	public getVaultAccountsAndSlots(): DataAndSlot<VaultAccount>[] {
		return Array.from(this.vault.values());
	}

	public getOraclePriceDataAndSlot(
		oraclePublicKey: PublicKey | string
	): DataAndSlot<OraclePriceData> | undefined {
		this.assertIsSubscribed();
		const oracleString =
			typeof oraclePublicKey === 'string'
				? oraclePublicKey
				: oraclePublicKey.toBase58();
		if (oracleString === ORACLE_DEFAULT_KEY) {
			return {
				data: QUOTE_ORACLE_PRICE_DATA,
				slot: 0,
			};
		}

		return this.oracles.get(oracleString);
	}

	public getOraclePriceDataAndSlotForMarket(
		marketIndex: number
	): DataAndSlot<OraclePriceData> | undefined {
		const perpMarketAccount = this.getMarketAccountAndSlot(marketIndex);
		const oracle = this.oracleMap.get(marketIndex);
		const oracleString = this.oracleStringMap.get(marketIndex);

		if (!perpMarketAccount || !oracle) {
			return undefined;
		}

		if (!perpMarketAccount.data.amm.oracle.equals(oracle)) {
			// If the oracle has changed, we need to update the oracle map in background
			this.setOracleMap();
		}

		return this.getOraclePriceDataAndSlot(oracleString);
	}

	public getOraclePriceDataAndSlotForVault(
		vaultIndex: number
	): DataAndSlot<OraclePriceData> | undefined {
		const vaultAccount = this.getVaultAccountAndSlot(vaultIndex);
		const oracle = this.vaultOracleMap.get(vaultIndex);
		const oracleString = this.vaultOracleStringMap.get(vaultIndex);
		if (!vaultAccount || !oracle) {
			return undefined;
		}

		if (!vaultAccount.data.oracle.equals(oracle)) {
			// If the oracle has changed, we need to update the oracle map in background
			this.setVaultOracleMap();
		}

		return this.getOraclePriceDataAndSlot(oracleString);
	}

	public updateAccountLoaderPollingFrequency(pollingFrequency: number): void {
		this.accountLoader.updatePollingFrequency(pollingFrequency);
	}
}

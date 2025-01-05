import {
	VaultAccount,
	MarketAccount,
	OracleSource,
	StateAccount,
	UserAccount,
	UserStatsAccount,
	InsuranceFundStake,
} from '../types';
import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { Context, PublicKey } from '@solana/web3.js';
import { Account } from '@solana/spl-token';
import { InsuranceFundAccount, OracleInfo, OraclePriceData } from '..';

export interface AccountSubscriber<T> {
	dataAndSlot?: DataAndSlot<T>;
	subscribe(onChange: (data: T) => void): Promise<void>;
	fetch(): Promise<void>;
	unsubscribe(): Promise<void>;

	setData(userAccount: T, slot?: number): void;
}

export interface ProgramAccountSubscriber<T> {
	subscribe(
		onChange: (
			accountId: PublicKey,
			data: T,
			context: Context,
			buffer: Buffer
		) => void
	): Promise<void>;
	unsubscribe(): Promise<void>;
}

export class NotSubscribedError extends Error {
	name = 'NotSubscribedError';
}

export interface NormalClientAccountEvents {
	stateAccountUpdate: (payload: StateAccount) => void;
	insurnaceFundAccountUpdate: (payload: InsuranceFundAccount) => void;
	marketAccountUpdate: (payload: MarketAccount) => void;
	vaultAccountUpdate: (payload: VaultAccount) => void;
	oraclePriceUpdate: (publicKey: PublicKey, data: OraclePriceData) => void;
	userAccountUpdate: (payload: UserAccount) => void;
	update: void;
	error: (e: Error) => void;
}

export interface NormalClientAccountSubscriber {
	eventEmitter: StrictEventEmitter<EventEmitter, NormalClientAccountEvents>;
	isSubscribed: boolean;

	subscribe(): Promise<boolean>;
	fetch(): Promise<void>;
	unsubscribe(): Promise<void>;

	addMarket(marketIndex: number): Promise<boolean>;
	addVault(vaultIndex: number): Promise<boolean>;
	addOracle(oracleInfo: OracleInfo): Promise<boolean>;
	setOracleMap(): Promise<void>;
	setVaultOracleMap(): Promise<void>;

	getStateAccountAndSlot(): DataAndSlot<StateAccount>;
	getInsuranceAccountAndSlot(): DataAndSlot<InsuranceFundAccount>;
	getMarketAccountAndSlot(
		marketIndex: number
	): DataAndSlot<MarketAccount> | undefined;
	getMarketAccountsAndSlots(): DataAndSlot<MarketAccount>[];
	getVaultAccountAndSlot(
		marketIndex: number
	): DataAndSlot<VaultAccount> | undefined;
	getVaultAccountsAndSlots(): DataAndSlot<VaultAccount>[];
	getOraclePriceDataAndSlot(
		oraclePublicKey: PublicKey | string
	): DataAndSlot<OraclePriceData> | undefined;
	getOraclePriceDataAndSlotForMarket(
		marketIndex: number
	): DataAndSlot<OraclePriceData> | undefined;
	getOraclePriceDataAndSlotForVault(
		vaultIndex: number
	): DataAndSlot<OraclePriceData> | undefined;

	updateAccountLoaderPollingFrequency?: (pollingFrequency: number) => void;
}

export enum DelistedMarketSetting {
	Unsubscribe,
	Subscribe,
	Discard,
}

export interface UserAccountEvents {
	userAccountUpdate: (payload: UserAccount) => void;
	update: void;
	error: (e: Error) => void;
}

export interface UserAccountSubscriber {
	eventEmitter: StrictEventEmitter<EventEmitter, UserAccountEvents>;
	isSubscribed: boolean;

	subscribe(userAccount?: UserAccount): Promise<boolean>;
	fetch(): Promise<void>;
	updateData(userAccount: UserAccount, slot: number): void;
	unsubscribe(): Promise<void>;

	getUserAccountAndSlot(): DataAndSlot<UserAccount>;
}

export interface TokenAccountEvents {
	tokenAccountUpdate: (payload: Account) => void;
	update: void;
	error: (e: Error) => void;
}

export interface TokenAccountSubscriber {
	eventEmitter: StrictEventEmitter<EventEmitter, TokenAccountEvents>;
	isSubscribed: boolean;

	subscribe(): Promise<boolean>;
	fetch(): Promise<void>;
	unsubscribe(): Promise<void>;

	getTokenAccountAndSlot(): DataAndSlot<Account>;
}

// TODO: do we need an InsuranceFundAccountSubscriber?

export interface InsuranceFundStakeAccountSubscriber {
	eventEmitter: StrictEventEmitter<
		EventEmitter,
		InsuranceFundStakeAccountEvents
	>;
	isSubscribed: boolean;

	subscribe(): Promise<boolean>;
	fetch(): Promise<void>;
	unsubscribe(): Promise<void>;

	getInsuranceFundStakeAccountAndSlot(): DataAndSlot<InsuranceFundStake>;
}

export interface InsuranceFundStakeAccountEvents {
	insuranceFundStakeAccountUpdate: (payload: InsuranceFundStake) => void;
	update: void;
	error: (e: Error) => void;
}

export interface OracleEvents {
	oracleUpdate: (payload: OraclePriceData) => void;
	update: void;
	error: (e: Error) => void;
}

export interface OracleAccountSubscriber {
	eventEmitter: StrictEventEmitter<EventEmitter, OracleEvents>;
	isSubscribed: boolean;

	subscribe(): Promise<boolean>;
	fetch(): Promise<void>;
	unsubscribe(): Promise<void>;

	getOraclePriceData(): DataAndSlot<OraclePriceData>;
}

export type AccountToPoll = {
	key: string;
	publicKey: PublicKey;
	eventType: string;
	callbackId?: string;
	mapKey?: number;
};

export type OraclesToPoll = {
	publicKey: PublicKey;
	source: OracleSource;
	callbackId?: string;
};

export type BufferAndSlot = {
	slot: number;
	buffer: Buffer | undefined;
};

export type DataAndSlot<T> = {
	data: T;
	slot: number;
};

export type ResubOpts = {
	resubTimeoutMs?: number;
	logResubMessages?: boolean;
};

export interface UserStatsAccountEvents {
	userStatsAccountUpdate: (payload: UserStatsAccount) => void;
	update: void;
	error: (e: Error) => void;
}

export interface UserStatsAccountSubscriber {
	eventEmitter: StrictEventEmitter<EventEmitter, UserStatsAccountEvents>;
	isSubscribed: boolean;

	subscribe(userStatsAccount?: UserStatsAccount): Promise<boolean>;
	fetch(): Promise<void>;
	unsubscribe(): Promise<void>;

	getUserStatsAccountAndSlot(): DataAndSlot<UserStatsAccount>;
}

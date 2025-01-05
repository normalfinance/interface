import {
	NormalClient,
	getUserStatsAccountPublicKey,
	UserStatsAccount,
	UserStats,
	WrappedEvent,
	NewUserRecord,
	LPRecord,
	InsuranceFundStakeRecord,
	BulkAccountLoader,
	PollingUserStatsAccountSubscriber,
} from '..';
import { PublicKey } from '@solana/web3.js';

import { UserMap } from './userMap';

export class UserStatsMap {
	/**
	 * map from authority pubkey to UserStats
	 */
	private userStatsMap = new Map<string, UserStats>();
	private normalClient: NormalClient;
	private bulkAccountLoader: BulkAccountLoader;

	/**
	 * Creates a new UserStatsMap instance.
	 *
	 * @param {NormalClient} normalClient - The NormalClient instance.
	 * @param {BulkAccountLoader} [bulkAccountLoader] - If not provided, a new BulkAccountLoader with polling disabled will be created.
	 */
	constructor(
		normalClient: NormalClient,
		bulkAccountLoader?: BulkAccountLoader
	) {
		this.normalClient = normalClient;
		if (!bulkAccountLoader) {
			bulkAccountLoader = new BulkAccountLoader(
				normalClient.connection,
				normalClient.opts.commitment,
				0
			);
		}
		this.bulkAccountLoader = bulkAccountLoader;
	}

	public async subscribe(authorities: PublicKey[]) {
		if (this.size() > 0) {
			return;
		}

		await this.normalClient.subscribe();
		await this.sync(authorities);
	}

	/**
	 *
	 * @param authority that owns the UserStatsAccount
	 * @param userStatsAccount optional UserStatsAccount to subscribe to, if undefined will be fetched later
	 * @param skipFetch if true, will not immediately fetch the UserStatsAccount
	 */
	public async addUserStat(
		authority: PublicKey,
		userStatsAccount?: UserStatsAccount,
		skipFetch?: boolean
	) {
		const userStat = new UserStats({
			normalClient: this.normalClient,
			userStatsAccountPublicKey: getUserStatsAccountPublicKey(
				this.normalClient.program.programId,
				authority
			),
			accountSubscription: {
				type: 'polling',
				accountLoader: this.bulkAccountLoader,
			},
		});
		if (skipFetch) {
			await (
				userStat.accountSubscriber as PollingUserStatsAccountSubscriber
			).addToAccountLoader();
		} else {
			await userStat.subscribe(userStatsAccount);
		}

		this.userStatsMap.set(authority.toString(), userStat);
	}

	// public async updateWithOrderRecord(record: OrderRecord, userMap: UserMap) {
	// 	const user = await userMap.mustGet(record.user.toString());
	// 	if (!this.has(user.getUserAccount().authority.toString())) {
	// 		await this.addUserStat(user.getUserAccount().authority, undefined, false);
	// 	}
	// }

	public async updateWithEventRecord(
		record: WrappedEvent<any>,
		userMap?: UserMap
	) {
		// if (record.eventType === 'OrderRecord') {
		// 	if (!userMap) {
		// 		return;
		// 	}
		// 	const orderRecord = record as OrderRecord;
		// 	await userMap.updateWithOrderRecord(orderRecord);
		// } else if (record.eventType === 'OrderActionRecord') {
		// 	if (!userMap) {
		// 		return;
		// 	}
		// 	const actionRecord = record as OrderActionRecord;

		// 	if (actionRecord.taker) {
		// 		const taker = await userMap.mustGet(actionRecord.taker.toString());
		// 		await this.mustGet(taker.getUserAccount().authority.toString());
		// 	}
		// 	if (actionRecord.maker) {
		// 		const maker = await userMap.mustGet(actionRecord.maker.toString());
		// 		await this.mustGet(maker.getUserAccount().authority.toString());
		// 	}
		// }
		if (record.eventType === 'NewUserRecord') {
			const newUserRecord = record as NewUserRecord;
			await this.mustGet(newUserRecord.userAuthority.toString());
		} else if (record.eventType === 'LPRecord') {
			if (!userMap) {
				return;
			}
			const lpRecord = record as LPRecord;
			const user = await userMap.mustGet(lpRecord.user.toString());
			await this.mustGet(user.getUserAccount().authority.toString());
		} else if (record.eventType === 'InsuranceFundStakeRecord') {
			const ifStakeRecord = record as InsuranceFundStakeRecord;
			await this.mustGet(ifStakeRecord.userAuthority.toString());
		}
	}

	public has(authorityPublicKey: string): boolean {
		return this.userStatsMap.has(authorityPublicKey);
	}

	public get(authorityPublicKey: string): UserStats {
		return this.userStatsMap.get(authorityPublicKey);
	}

	/**
	 * Enforce that a UserStats will exist for the given authorityPublicKey,
	 * reading one from the blockchain if necessary.
	 * @param authorityPublicKey
	 * @returns
	 */
	public async mustGet(authorityPublicKey: string): Promise<UserStats> {
		if (!this.has(authorityPublicKey)) {
			await this.addUserStat(
				new PublicKey(authorityPublicKey),
				undefined,
				false
			);
		}
		return this.get(authorityPublicKey);
	}

	public values(): IterableIterator<UserStats> {
		return this.userStatsMap.values();
	}

	public size(): number {
		return this.userStatsMap.size;
	}

	/**
	 * Sync the UserStatsMap
	 * @param authorities list of authorities to derive UserStatsAccount public keys from.
	 * You may want to get this list from UserMap in order to filter out idle users
	 */
	public async sync(authorities: PublicKey[]) {
		await Promise.all(
			authorities.map((authority) =>
				this.addUserStat(authority, undefined, true)
			)
		);
		await this.bulkAccountLoader.load();
	}

	public async unsubscribe() {
		for (const [key, userStats] of this.userStatsMap.entries()) {
			await userStats.unsubscribe();
			this.userStatsMap.delete(key);
		}
	}
}

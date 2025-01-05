import { AuctionSubscriberConfig, AuctionSubscriberEvents } from './types';
import { NormalClient } from '../normalClient';
import { getUserFilter, getUserWithAuctionFilter } from '../memcmp';
import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';
import { UserAccount } from '../types';
import { ConfirmOptions, Context, PublicKey } from '@solana/web3.js';
import { WebSocketProgramAccountSubscriber } from '../accounts/webSocketProgramAccountSubscriber';
import { ResubOpts } from '../accounts/types';

export class AuctionSubscriber {
	private normalClient: NormalClient;
	private opts: ConfirmOptions;
	private resubOpts?: ResubOpts;

	eventEmitter: StrictEventEmitter<EventEmitter, AuctionSubscriberEvents>;
	private subscriber: WebSocketProgramAccountSubscriber<UserAccount>;

	constructor({
		normalClient,
		opts,
		resubTimeoutMs,
		logResubMessages,
	}: AuctionSubscriberConfig) {
		this.normalClient = normalClient;
		this.opts = opts || this.normalClient.opts;
		this.eventEmitter = new EventEmitter();
		this.resubOpts = { resubTimeoutMs, logResubMessages };
	}

	public async subscribe() {
		if (!this.subscriber) {
			this.subscriber = new WebSocketProgramAccountSubscriber<UserAccount>(
				'AuctionSubscriber',
				'User',
				this.normalClient.program,
				this.normalClient.program.account.user.coder.accounts.decode.bind(
					this.normalClient.program.account.user.coder.accounts
				),
				{
					filters: [getUserFilter(), getUserWithAuctionFilter()],
					commitment: this.opts.commitment,
				},
				this.resubOpts
			);
		}

		await this.subscriber.subscribe(
			(accountId: PublicKey, data: UserAccount, context: Context) => {
				this.eventEmitter.emit(
					'onAccountUpdate',
					data,
					accountId,
					context.slot
				);
			}
		);
	}

	public async unsubscribe() {
		if (!this.subscriber) {
			return;
		}
		this.subscriber.unsubscribe();
	}
}

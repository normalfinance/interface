import { AdminClient } from './adminClient';
import { ConfirmOptions, Signer, Transaction } from '@solana/web3.js';
import { TxSigAndSlot } from './tx/types';
import { PollingNormalClientAccountSubscriber } from './accounts/pollingNormalClientAccountSubscriber';
import { NormalClientConfig } from './normalClientConfig';

export class TestClient extends AdminClient {
	public constructor(config: NormalClientConfig) {
		if (config.accountSubscription.type !== 'polling') {
			throw new Error('Test client must be polling');
		}
		super(config);
	}

	async sendTransaction(
		tx: Transaction,
		additionalSigners?: Array<Signer>,
		opts?: ConfirmOptions,
		preSigned?: boolean
	): Promise<TxSigAndSlot> {
		const { txSig, slot } = await super.sendTransaction(
			tx,
			additionalSigners,
			opts,
			preSigned
		);

		let lastFetchedSlot = (
			this.accountSubscriber as PollingNormalClientAccountSubscriber
		).accountLoader.mostRecentSlot;
		await this.fetchAccounts();
		while (lastFetchedSlot < slot) {
			await this.fetchAccounts();
			lastFetchedSlot = (
				this.accountSubscriber as PollingNormalClientAccountSubscriber
			).accountLoader.mostRecentSlot;
		}

		return { txSig, slot };
	}
}

import { NormalClient } from './normalClient';
import { Commitment, PublicKey } from '@solana/web3.js';
import { BulkAccountLoader } from './accounts/bulkAccountLoader';
import { UserAccountSubscriber } from './accounts/types';

export type UserConfig = {
	accountSubscription?: UserSubscriptionConfig;
	normalClient: NormalClient;
	userAccountPublicKey: PublicKey;
};

export type UserSubscriptionConfig =
	| {
			type: 'websocket';
			resubTimeoutMs?: number;
			logResubMessages?: boolean;
			commitment?: Commitment;
	  }
	| {
			type: 'polling';
			accountLoader: BulkAccountLoader;
	  }
	| {
			type: 'custom';
			userAccountSubscriber: UserAccountSubscriber;
	  };

import { NormalClient } from './normalClient';
import { Commitment, PublicKey } from '@solana/web3.js';
import { BulkAccountLoader } from './accounts/bulkAccountLoader';

export type UserStatsConfig = {
	accountSubscription?: UserStatsSubscriptionConfig;
	normalClient: NormalClient;
	userStatsAccountPublicKey: PublicKey;
};

export type UserStatsSubscriptionConfig =
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
	  };

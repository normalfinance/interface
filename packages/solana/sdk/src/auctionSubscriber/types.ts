import { NormalClient } from '../normalClient';
import { UserAccount } from '../types';
import { ConfirmOptions, PublicKey } from '@solana/web3.js';

export type AuctionSubscriberConfig = {
	normalClient: NormalClient;
	opts?: ConfirmOptions;
	resubTimeoutMs?: number;
	logResubMessages?: boolean;
};

export interface AuctionSubscriberEvents {
	onAccountUpdate: (
		account: UserAccount,
		pubkey: PublicKey,
		slot: number
	) => void;
}

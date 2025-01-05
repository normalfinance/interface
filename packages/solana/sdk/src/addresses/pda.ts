import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SpotMarketAccount } from '..';

export async function getNormalStateAccountPublicKeyAndNonce(
	programId: PublicKey
): Promise<[PublicKey, number]> {
	return PublicKey.findProgramAddress(
		[Buffer.from(anchor.utils.bytes.utf8.encode('normal_state'))],
		programId
	);
}

export async function getNormalStateAccountPublicKey(
	programId: PublicKey
): Promise<PublicKey> {
	return (await getNormalStateAccountPublicKeyAndNonce(programId))[0];
}

export async function getUserAccountPublicKeyAndNonce(
	programId: PublicKey,
	authority: PublicKey,
	subAccountId = 0
): Promise<[PublicKey, number]> {
	return PublicKey.findProgramAddress(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('user')),
			authority.toBuffer(),
			new anchor.BN(subAccountId).toArrayLike(Buffer, 'le', 2),
		],
		programId
	);
}

export async function getUserAccountPublicKey(
	programId: PublicKey,
	authority: PublicKey,
	subAccountId = 0
): Promise<PublicKey> {
	return (
		await getUserAccountPublicKeyAndNonce(programId, authority, subAccountId)
	)[0];
}

export function getUserAccountPublicKeySync(
	programId: PublicKey,
	authority: PublicKey,
	subAccountId = 0
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('user')),
			authority.toBuffer(),
			new anchor.BN(subAccountId).toArrayLike(Buffer, 'le', 2),
		],
		programId
	)[0];
}

export function getUserStatsAccountPublicKey(
	programId: PublicKey,
	authority: PublicKey
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('user_stats')),
			authority.toBuffer(),
		],
		programId
	)[0];
}

export async function getSynthMarketPublicKey(
	programId: PublicKey,
	marketIndex: number
): Promise<PublicKey> {
	return (
		await PublicKey.findProgramAddress(
			[
				Buffer.from(anchor.utils.bytes.utf8.encode('synth_market')),
				new anchor.BN(marketIndex).toArrayLike(Buffer, 'le', 2),
			],
			programId
		)
	)[0];
}

export function getSynthMarketPublicKeySync(
	programId: PublicKey,
	marketIndex: number
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('synth_market')),
			new anchor.BN(marketIndex).toArrayLike(Buffer, 'le', 2),
		],
		programId
	)[0];
}

export async function getIndexMarketPublicKey(
	programId: PublicKey,
	marketIndex: number
): Promise<PublicKey> {
	return (
		await PublicKey.findProgramAddress(
			[
				Buffer.from(anchor.utils.bytes.utf8.encode('index_market')),
				new anchor.BN(marketIndex).toArrayLike(Buffer, 'le', 2),
			],
			programId
		)
	)[0];
}

export function getIndexMarketPublicKeySync(
	programId: PublicKey,
	marketIndex: number
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('index_market')),
			new anchor.BN(marketIndex).toArrayLike(Buffer, 'le', 2),
		],
		programId
	)[0];
}

export async function getInsuranceFundPublicKey(
	programId: PublicKey
): Promise<PublicKey> {
	return (
		await PublicKey.findProgramAddress(
			[Buffer.from(anchor.utils.bytes.utf8.encode('insurance_fund'))],
			programId
		)
	)[0];
}

export async function getInsuranceFundVaultPublicKey(
	programId: PublicKey
): Promise<PublicKey> {
	return (
		await PublicKey.findProgramAddress(
			[Buffer.from(anchor.utils.bytes.utf8.encode('insurance_fund_vault'))],
			programId
		)
	)[0];
}

export function getInsuranceFundStakeAccountPublicKey(
	programId: PublicKey,
	authority: PublicKey
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('insurance_fund_stake')),
			authority.toBuffer(),
		],
		programId
	)[0];
}

export function getNormalSignerPublicKey(programId: PublicKey): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode('normal_signer'))],
		programId
	)[0];
}

export function getReferrerNamePublicKeySync(
	programId: PublicKey,
	nameBuffer: number[]
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('referrer_name')),
			Buffer.from(nameBuffer),
		],
		programId
	)[0];
}

export function getProtocolIfSharesTransferConfigPublicKey(
	programId: PublicKey
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[Buffer.from(anchor.utils.bytes.utf8.encode('if_shares_transfer_config'))],
		programId
	)[0];
}

export function getPythPullOraclePublicKey(
	progarmId: PublicKey,
	feedId: Uint8Array
): PublicKey {
	return PublicKey.findProgramAddressSync(
		[
			Buffer.from(anchor.utils.bytes.utf8.encode('pyth_pull')),
			Buffer.from(feedId),
		],
		progarmId
	)[0];
}
export function getTokenProgramForMarket(
	marketAccount: SpotMarketAccount
): PublicKey {
	if (marketAccount.tokenProgram === 1) {
		return TOKEN_2022_PROGRAM_ID;
	}
	return TOKEN_PROGRAM_ID;
}

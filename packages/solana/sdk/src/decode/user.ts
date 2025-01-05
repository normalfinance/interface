import { UserAccount } from '../types';
import { PublicKey } from '@solana/web3.js';
import { BN, VaultPosition } from '../';
import { ZERO } from '../';

function readUnsignedBigInt64LE(buffer: Buffer, offset: number): BN {
	return new BN(buffer.subarray(offset, offset + 8), 10, 'le');
}

function readSignedBigInt64LE(buffer: Buffer, offset: number): BN {
	const unsignedValue = new BN(buffer.subarray(offset, offset + 8), 10, 'le');
	if (unsignedValue.testn(63)) {
		const inverted = unsignedValue.notn(64).addn(1);
		return inverted.neg();
	} else {
		return unsignedValue;
	}
}

export function decodeUser(buffer: Buffer): UserAccount {
	let offset = 8;
	const authority = new PublicKey(buffer.slice(offset, offset + 32));
	offset += 32;
	const delegate = new PublicKey(buffer.slice(offset, offset + 32));
	offset += 32;
	const name = [];
	for (let i = 0; i < 32; i++) {
		name.push(buffer.readUint8(offset + i));
	}
	offset += 32;

	const vaultPositions: VaultPosition[] = [];
	for (let i = 0; i < 8; i++) {
		const baseAssetAmount = readSignedBigInt64LE(buffer, offset + 8);
		const quoteAssetAmount = readSignedBigInt64LE(buffer, offset + 16);
		const lpShares = readUnsignedBigInt64LE(buffer, offset + 64);
		const openOrders = buffer.readUInt8(offset + 94);

		if (
			baseAssetAmount.eq(ZERO) &&
			openOrders === 0 &&
			quoteAssetAmount.eq(ZERO) &&
			lpShares.eq(ZERO)
		) {
			offset += 96;
			continue;
		}

		const lastCumulativeFundingRate = readSignedBigInt64LE(buffer, offset);
		offset += 24;
		const quoteBreakEvenAmount = readSignedBigInt64LE(buffer, offset);
		offset += 8;
		const quoteEntryAmount = readSignedBigInt64LE(buffer, offset);
		offset += 8;
		const openBids = readSignedBigInt64LE(buffer, offset);
		offset += 8;
		const openAsks = readSignedBigInt64LE(buffer, offset);
		offset += 8;
		const settledPnl = readSignedBigInt64LE(buffer, offset);
		offset += 16;
		const lastBaseAssetAmountPerLp = readSignedBigInt64LE(buffer, offset);
		offset += 8;
		const lastQuoteAssetAmountPerLp = readSignedBigInt64LE(buffer, offset);
		offset += 8;
		const remainderBaseAssetAmount = buffer.readInt32LE(offset);
		offset += 4;
		const marketIndex = buffer.readUInt16LE(offset);
		offset += 3;
		const perLpBase = buffer.readUInt8(offset);
		offset += 1;

		vaultPositions.push({
			lastCumulativeFundingRate,
			baseAssetAmount,
			quoteAssetAmount,
			quoteBreakEvenAmount,
			quoteEntryAmount,
			openBids,
			openAsks,
			settledPnl,
			lpShares,
			lastBaseAssetAmountPerLp,
			lastQuoteAssetAmountPerLp,
			remainderBaseAssetAmount,
			marketIndex,
			openOrders,
			perLpBase,
		});
	}

	const lastActiveSlot = readUnsignedBigInt64LE(buffer, offset);
	offset += 8;

	const subAccountId = buffer.readUInt16LE(offset);
	offset += 2;

	const status = buffer.readUInt8(offset);
	offset += 1;

	const idle = buffer.readUInt8(offset) === 1;
	offset += 1;

	// @ts-ignore
	return {
		authority,
		delegate,
		name,
		vaultPositions,
		lastActiveSlot,
		subAccountId,
		status,
		idle,
	};
}
